const { getPool } = require('./db');

function matchFilter(doc, filter) {
  if (!filter || Object.keys(filter).length === 0) return true;

  for (let key in filter) {
    const val = filter[key];

    if (key === '$or') {
      if (!Array.isArray(val)) return false;
      const match = val.some(subFilter => matchFilter(doc, subFilter));
      if (!match) return false;
      continue;
    }

    const docVal = doc[key];

    if (val && typeof val === 'object' && !Array.isArray(val)) {
      for (let op in val) {
        const opVal = val[op];
        if (op === '$ne' && docVal === opVal) return false;
        if (op === '$eq' && docVal !== opVal) return false;
        if (op === '$gte' && !(docVal >= opVal)) return false;
        if (op === '$lte' && !(docVal <= opVal)) return false;
        if (op === '$gt' && !(docVal > opVal)) return false;
        if (op === '$lt' && !(docVal < opVal)) return false;
        if (op === '$regex') {
          const options = val['$options'] || '';
          const regex = new RegExp(opVal, options);
          if (!regex.test(docVal || '')) return false;
        }
      }
    } else {
      if (docVal !== val) return false;
    }
  }
  return true;
}

class PostgresQuery {
  constructor(model, resultsPromise) {
    this.model = model;
    this.resultsPromise = resultsPromise;
    this.sortOptions = null;
  }

  sort(options) {
    this.sortOptions = options;
    return this;
  }

  async then(resolve, reject) {
    try {
      let results = await this.resultsPromise;
      if (this.sortOptions) {
        results = [...results];
        results.sort((a, b) => {
          for (let key in this.sortOptions) {
            let dir = this.sortOptions[key]; // 1 or -1
            let valA = a[key];
            let valB = b[key];
            
            if (valA === undefined || valA === null) valA = '';
            if (valB === undefined || valB === null) valB = '';
            
            if (valA < valB) return dir === -1 ? 1 : -1;
            if (valA > valB) return dir === -1 ? -1 : 1;
          }
          return 0;
        });
      }
      resolve(results);
    } catch (err) {
      reject(err);
    }
  }
}

class PostgresModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async _getAll() {
    const pool = getPool();
    const { rows } = await pool.query(`SELECT doc FROM ${this.tableName}`);
    return rows.map(r => r.doc);
  }

  find(filter = {}) {
    const p = (async () => {
      const all = await this._getAll();
      return all.filter(doc => matchFilter(doc, filter));
    })();
    return new PostgresQuery(this, p);
  }

  async findOne(filter = {}) {
    const all = await this._getAll();
    return all.find(doc => matchFilter(doc, filter)) || null;
  }

  async findById(id) {
    const pool = getPool();
    const { rows } = await pool.query(`SELECT doc FROM ${this.tableName} WHERE id = $1`, [String(id)]);
    return rows.length > 0 ? rows[0].doc : null;
  }

  async create(data) {
    const pool = getPool();
    const doc = { ...data };
    
    if (!doc._id) {
      doc._id = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    }
    doc.id = doc._id;
    doc.createdAt = doc.createdAt || new Date().toISOString();
    doc.updatedAt = new Date().toISOString();

    const insertDoc = JSON.stringify(doc);
    await pool.query(
      `INSERT INTO ${this.tableName} (id, doc) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET doc = EXCLUDED.doc`,
      [doc.id, insertDoc]
    );
    return doc;
  }

  async findByIdAndUpdate(id, update, options = {}) {
    const pool = getPool();
    const current = await this.findById(id);
    if (!current) return null;

    const updatedDoc = {
      ...current,
      ...update,
      _id: id,
      id: id,
      updatedAt: new Date().toISOString()
    };

    await pool.query(
      `UPDATE ${this.tableName} SET doc = $2 WHERE id = $1`,
      [String(id), JSON.stringify(updatedDoc)]
    );
    return updatedDoc;
  }

  async findByIdAndDelete(id) {
    const pool = getPool();
    const current = await this.findById(id);
    if (!current) return null;

    await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [String(id)]);
    return current;
  }

  async countDocuments(filter = {}) {
    const all = await this._getAll();
    return all.filter(doc => matchFilter(doc, filter)).length;
  }

  async deleteMany(filter = {}) {
    const pool = getPool();
    const all = await this._getAll();
    const toDelete = all.filter(doc => matchFilter(doc, filter));
    for (let doc of toDelete) {
      await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [doc.id]);
    }
    return { deletedCount: toDelete.length };
  }

  async insertMany(docs) {
    const inserted = [];
    for (let doc of docs) {
      const saved = await this.create(doc);
      inserted.push(saved);
    }
    return inserted;
  }

  async aggregate(pipeline) {
    const pool = getPool();
    const query = `
      SELECT 
        doc->>'date' as _id,
        COALESCE(SUM(CAST(doc->>'totalAmount' AS NUMERIC)), 0) as revenue,
        COALESCE(SUM(
          CASE 
            WHEN doc->'products' IS NOT NULL AND jsonb_typeof(doc->'products') = 'array' THEN
              (SELECT COALESCE(SUM(COALESCE((p->>'morningQty')::numeric, 0)), 0) 
               FROM jsonb_array_elements(doc->'products') AS p)
            ELSE 0
          END
        ), 0) as morningqty,
        COALESCE(SUM(
          CASE 
            WHEN doc->'products' IS NOT NULL AND jsonb_typeof(doc->'products') = 'array' THEN
              (SELECT COALESCE(SUM(COALESCE((p->>'eveningQty')::numeric, 0)), 0) 
               FROM jsonb_array_elements(doc->'products') AS p)
            ELSE 0
          END
        ), 0) as eveningqty
      FROM orders
      GROUP BY doc->>'date'
      ORDER BY doc->>'date' ASC
      LIMIT 7;
    `;
    const { rows } = await pool.query(query);
    return rows.map(r => ({
      _id: r._id,
      morningQty: Number(r.morningqty) || 0,
      eveningQty: Number(r.eveningqty) || 0,
      revenue: parseFloat(Number(r.revenue).toFixed(2)) || 0
    }));
  }
}

module.exports = PostgresModel;
