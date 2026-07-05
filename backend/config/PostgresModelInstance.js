class PostgresModelInstance {
  constructor(model, data) {
    this._model = model;
    Object.assign(this, data);
  }

  async save() {
    // If the instance has a primary key _id, perform an update, otherwise perform a create
    if (this._id) {
      const updated = await this._model.findByIdAndUpdate(this._id, this);
      Object.assign(this, updated);
      return this;
    } else {
      const created = await this._model.create(this);
      Object.assign(this, created);
      return this;
    }
  }
}

module.exports = PostgresModelInstance;
