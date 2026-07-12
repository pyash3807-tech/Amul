import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { Plus, Download, Edit2, Trash2, Search, X, Eye, EyeOff, User, Clock, ArrowLeft, Smartphone } from 'lucide-react';
import axios from 'axios';

const Container = styled.div`
  font-family: 'Public Sans', 'Inter', sans-serif;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0 0 4px 0;
`;

const Breadcrumb = styled.div`
  font-size: 13px;
  color: ${props => props.theme.muted};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const BreadLink = styled.span`
  cursor: pointer;
  color: ${props => props.theme.text};
  font-weight: 500;
  &:hover {
    color: ${props => props.theme.primary};
    text-decoration: underline;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const LeftActions = styled.div`
  display: flex;
  gap: 12px;
`;

const OutlineBtn = styled.button`
  padding: 8px 20px;
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 1.5px solid ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => `${props.theme.primary}10`};
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 280px;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 14px 10px 38px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const SearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.muted};
  display: flex;
  align-items: center;
`;

// TABLE SYSTEM
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.theme.card};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  padding: ${props => props.dense ? '10px 16px' : '16px'};
  background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
  color: ${props => props.theme.muted};
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const Td = styled.td`
  padding: ${props => props.dense ? '8px 16px' : '14px 16px'};
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
`;

const CompanyNameTd = styled(Td)`
  font-weight: 700;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const Pill = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${props => props.active ? '#e2f9ec' : '#ffe8e6'};
  color: ${props => props.active ? '#00AB55' : '#ff4842'};
`;

const ActionIcon = styled.button`
  background: none;
  border: none;
  color: ${props => props.colorVal || props.theme.text};
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  }
`;

// FOOTER
const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  flex-wrap: wrap;
  gap: 16px;
  background-color: ${props => props.theme.card};
  border-top: 1px solid ${props => props.theme.border};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
`;

const FooterLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.theme.muted};
`;

const FooterRight = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: ${props => props.theme.text};
`;

const NavArrows = styled.div`
  display: flex;
  gap: 8px;
`;

const ArrowBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;

  &:disabled {
    color: ${props => props.theme.muted};
    cursor: not-allowed;
  }
`;

const DenseToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
`;

const Switch = styled.input`
  cursor: pointer;
`;

// MODAL
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  width: 480px;
  max-width: 90%;
  border-radius: 16px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  padding: 24px;
  position: relative;
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const ModalTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  margin: 0;
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.theme.muted};
  margin-bottom: 6px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const Select = styled.select`
  padding: 10px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
`;

const CancelBtn = styled.button`
  padding: 10px 20px;
  background: none;
  border: none;
  font-weight: 600;
  cursor: pointer;
  color: ${props => props.theme.muted};
`;

const PrimaryBtn = styled.button`
  padding: 10px 20px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px ${props => `${props.theme.primary}24`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
  }
`;

const EditContainer = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 24px 0 16px 0;
  width: 100%;
  border-bottom: 1.5px solid ${props => props.theme.border};
  padding-bottom: 8px;
`;

const FieldContainer = styled.div`
  position: relative;
  margin-bottom: 20px;
  width: 100%;
`;

const FieldLabel = styled.span`
  position: absolute;
  top: -8px;
  left: 12px;
  background-color: ${props => props.theme.card};
  padding: 0 6px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.muted};
  transition: all 0.2s;
  z-index: 1;
`;

const OutlinedInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const OutlinedSelect = styled.select`
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};
  color: ${props => props.theme.text};
  box-sizing: border-box;
  appearance: none;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const OutlinedTextarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  box-sizing: border-box;
  min-height: 80px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const FieldIconWrapper = styled.div`
  position: absolute;
  right: 14px;
  top: 13px;
  color: ${props => props.theme.muted};
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const TabContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${props => props.theme.border};
  margin-bottom: 24px;
  gap: 8px;
`;

const Tab = styled.button`
  padding: 12px 16px;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? props.theme.primary : props.theme.muted};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: ${props => props.theme.primary};
  }
`;

const FullWidthField = styled(FieldContainer)`
  grid-column: span 2;
  @media (max-width: 768px) {
    grid-column: span 1;
  }
`;

const TypePill = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  border: 1.5px solid #d0e2ff;
  color: #0d6efd;
  background-color: transparent;
`;

const SubmitRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
`;


const Users = ({ setActiveTab, token }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [subView, setSubView] = useState('list');
  const [editTab, setEditTab] = useState('personal_details');
  const [showPassword, setShowPassword] = useState(false);
  const [companiesList, setCompaniesList] = useState([]);

  // Modals States
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  const [currentUser, setCurrentUser] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    companyName: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    type: 'Retailer',
    status: 'Active',
    role: 'Retailer',
    middleName: '',
    parentCompany: 'Yash Milk Marketing-Rajkot-1007459M',
    company: 'Zepto-Mavdi-1',
    address: '',
    society: '',
    ward: '',
    state: 'Gujarat',
    city: 'Rajkot',
    pincode: '',
    whatsapp: '',
    mobile1: '',
    mobile2: '',
    email: '',
    aadhaarCard: '',
    panCard: '',
    drivingLicense: '',
    electricityBill: ''
  });

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompaniesList(res.data);
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchCompanies();
    }
  }, [token]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Filter & Paginate
  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    return (
      user.companyName?.toLowerCase().includes(term) ||
      user.username?.toLowerCase().includes(term) ||
      user.firstName?.toLowerCase().includes(term) ||
      user.lastName?.toLowerCase().includes(term) ||
      user.type?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleOpenAdd = () => {
    setFormData({
      companyName: '',
      company: '',
      username: '',
      password: '',
      firstName: '',
      lastName: '',
      type: 'Retailer',
      status: 'Active',
      role: 'Retailer',
      middleName: '',
      parentCompany: 'Yash Milk Marketing-Rajkot-1007459M',
      address: '',
      society: '',
      ward: '',
      state: 'Gujarat',
      city: 'Rajkot',
      pincode: '',
      whatsapp: '',
      mobile1: '',
      mobile2: '',
      email: '',
      aadhaarCard: '',
      panCard: '',
      drivingLicense: '',
      electricityBill: ''
    });
    setAddModalOpen(true);
  };

  const handleOpenEdit = (user) => {
    setCurrentUser(user);
    setFormData({
      companyName: user.companyName || '',
      username: user.username || '',
      password: '', // leave blank
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      type: user.type || 'Retailer',
      status: user.status || 'Active',
      role: user.role || 'Retailer',
      middleName: user.middleName || '',
      parentCompany: user.parentCompany || 'Yash Milk Marketing-Rajkot-1007459M',
      company: user.company || 'Zepto-Mavdi-1',
      address: user.address || '',
      society: user.society || '',
      ward: user.ward || '',
      state: user.state || 'Gujarat',
      city: user.city || 'Rajkot',
      pincode: user.pincode || '',
      whatsapp: user.whatsapp || '',
      mobile1: user.mobile1 || '',
      mobile2: user.mobile2 || '',
      email: user.email || '',
      aadhaarCard: user.aadhaarCard || '',
      panCard: user.panCard || '',
      drivingLicense: user.drivingLicense || '',
      electricityBill: user.electricityBill || ''
    });
    setSubView('edit');
    setEditTab('personal_details');
    setShowPassword(false);
  };

  const handleOpenDelete = (user) => {
    setCurrentUser(user);
    setDeleteModalOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'company') {
        updated.companyName = value;
      }
      return updated;
    });
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding user');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/users/${currentUser._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubView('list');
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating user');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/api/users/${currentUser._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeleteModalOpen(false);
      fetchUsers();
    } catch (err) {
      alert('Error deleting user');
    }
  };

  const handleImport = () => {
    alert("Import Users triggered! Place XML/CSV upload logic here.");
  };

  return (
    <Container>
      {subView === 'edit' ? (
        <>
          <Breadcrumb theme={theme}>
            <BreadLink theme={theme} onClick={() => setActiveTab('dashboard')}>{t('Dashboard')}</BreadLink>
            <span>•</span>
            <BreadLink theme={theme} onClick={() => setSubView('list')}>Users</BreadLink>
            <span>•</span>
            <span>{formData.firstName} {formData.lastName}</span>
          </Breadcrumb>

          <HeaderRow>
            <div>
              <Title theme={theme} style={{ margin: 0 }}>Edit User</Title>
            </div>
            <OutlineBtn theme={theme} onClick={() => setSubView('list')}>
              <ArrowLeft size={16} /> Back to Users
            </OutlineBtn>
          </HeaderRow>

          <EditContainer theme={theme}>
            <TabContainer theme={theme}>
              <Tab 
                type="button" 
                active={editTab === 'personal_details'} 
                onClick={() => setEditTab('personal_details')} 
                theme={theme}
              >
                Personal Details
              </Tab>
              <Tab 
                type="button" 
                active={editTab === 'address_details'} 
                onClick={() => setEditTab('address_details')} 
                theme={theme}
              >
                Address Details
              </Tab>
              <Tab 
                type="button" 
                active={editTab === 'contact_details'} 
                onClick={() => setEditTab('contact_details')} 
                theme={theme}
              >
                Contact Details
              </Tab>
              <Tab 
                type="button" 
                active={editTab === 'document_details'} 
                onClick={() => setEditTab('document_details')} 
                theme={theme}
              >
                Document Details
              </Tab>
            </TabContainer>

            <form onSubmit={handleEditSubmit}>
              {editTab === 'personal_details' && (
                <FormGrid>
                  <FieldContainer>
                    <FieldLabel theme={theme}>First Name</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="firstName" 
                      value={formData.firstName} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Middle Name</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="middleName" 
                      value={formData.middleName} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Last Name</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Username</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="username" 
                      value={formData.username} 
                      onChange={handleFormChange} 
                      theme={theme} 
                      disabled
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Password</FieldLabel>
                    <OutlinedInput 
                      type={showPassword ? "text" : "password"} 
                      name="password" 
                      value={formData.password} 
                      placeholder="••••••••••••"
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme} onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </FieldIconWrapper>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>User Type</FieldLabel>
                    <OutlinedSelect 
                      name="type" 
                      value={formData.type} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      <option value="Retailer">Retailer</option>
                      <option value="Admin">Admin</option>
                      <option value="Driver">Driver</option>
                    </OutlinedSelect>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Parent Company (HEAD)</FieldLabel>
                    <OutlinedSelect 
                      name="parentCompany" 
                      value={formData.parentCompany} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      <option value="Yash Milk Marketing-Rajkot-1007459M">Yash Milk Marketing-Rajkot-1007459M</option>
                    </OutlinedSelect>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Company</FieldLabel>
                    <OutlinedSelect 
                      name="company" 
                      value={formData.company} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      {companiesList.length > 0 ? (
                        companiesList.filter(comp => comp.status === 'Active').map(comp => (
                          <option key={comp._id} value={comp.firmName}>
                            {comp.firmName}
                          </option>
                        ))
                      ) : (
                        <option value="Zepto-Mavdi-1">Zepto-Mavdi-1</option>
                      )}
                    </OutlinedSelect>
                  </FieldContainer>
                </FormGrid>
              )}

              {editTab === 'address_details' && (
                <FormGrid>
                  <FullWidthField theme={theme}>
                    <FieldLabel theme={theme}>Address</FieldLabel>
                    <OutlinedTextarea 
                      name="address" 
                      value={formData.address} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FullWidthField>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Society</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="society" 
                      value={formData.society} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Ward</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="ward" 
                      value={formData.ward} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>State</FieldLabel>
                    <OutlinedSelect 
                      name="state" 
                      value={formData.state} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      <option value="Gujarat">Gujarat</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Rajasthan">Rajasthan</option>
                    </OutlinedSelect>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>City</FieldLabel>
                    <OutlinedSelect 
                      name="city" 
                      value={formData.city} 
                      onChange={handleFormChange} 
                      theme={theme}
                    >
                      <option value="Rajkot">Rajkot</option>
                      <option value="Ahmedabad">Ahmedabad</option>
                      <option value="Surat">Surat</option>
                      <option value="Vadodara">Vadodara</option>
                    </OutlinedSelect>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Pincode</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="pincode" 
                      value={formData.pincode} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                </FormGrid>
              )}

              {editTab === 'contact_details' && (
                <FormGrid>
                  <FieldContainer>
                    <FieldLabel theme={theme}>WhatsApp Number</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="whatsapp" 
                      value={formData.whatsapp} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme}>
                      <Smartphone size={18} />
                    </FieldIconWrapper>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Mobile Number 1</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="mobile1" 
                      value={formData.mobile1} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme}>
                      <Smartphone size={18} />
                    </FieldIconWrapper>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Mobile Number 2</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="mobile2" 
                      value={formData.mobile2} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                    <FieldIconWrapper theme={theme}>
                      <Smartphone size={18} />
                    </FieldIconWrapper>
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Email</FieldLabel>
                    <OutlinedInput 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                </FormGrid>
              )}

              {editTab === 'document_details' && (
                <FormGrid>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Aadhaar Card</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="aadhaarCard" 
                      value={formData.aadhaarCard} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>PAN Card</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="panCard" 
                      value={formData.panCard} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Driving License</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="drivingLicense" 
                      value={formData.drivingLicense} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                  <FieldContainer>
                    <FieldLabel theme={theme}>Electricity Bill</FieldLabel>
                    <OutlinedInput 
                      type="text" 
                      name="electricityBill" 
                      value={formData.electricityBill} 
                      onChange={handleFormChange} 
                      theme={theme} 
                    />
                  </FieldContainer>
                </FormGrid>
              )}

              <SubmitRow>
                <PrimaryBtn type="submit" theme={theme}>Save Changes</PrimaryBtn>
              </SubmitRow>
            </form>
          </EditContainer>
        </>
      ) : (
        <>
          <Title theme={theme}>{t('Users')}</Title>
          <Breadcrumb theme={theme}>
            <BreadLink theme={theme} onClick={() => setActiveTab('dashboard')}>Dashboard</BreadLink>
            <span>•</span>
            <span>Users</span>
          </Breadcrumb>

          <ActionsRow>
            <LeftActions>
              <OutlineBtn theme={theme} onClick={handleOpenAdd}>
                <Plus size={16} />
                + Add New User
              </OutlineBtn>
              <OutlineBtn theme={theme} onClick={handleImport}>
                <Download size={16} />
                Import Users
              </OutlineBtn>
            </LeftActions>
            <SearchWrapper>
              <SearchIconWrapper theme={theme}>
                <Search size={18} />
              </SearchIconWrapper>
              <SearchInput 
                type="text" 
                placeholder="Search user..." 
                value={searchTerm} 
                onChange={handleSearch}
                theme={theme}
              />
            </SearchWrapper>
          </ActionsRow>

          <TableWrapper theme={theme}>
            <Table>
              <thead>
                <tr>
                  <Th theme={theme} dense={dense}></Th>
                  <Th theme={theme} dense={dense}>Company Name</Th>
                  <Th theme={theme} dense={dense}>
                    Username <span style={{ marginLeft: '4px' }}>↑</span>
                  </Th>
                  <Th theme={theme} dense={dense}>First Name</Th>
                  <Th theme={theme} dense={dense}>Last Name</Th>
                  <Th theme={theme} dense={dense}>Type</Th>
                  <Th theme={theme} dense={dense}>Status</Th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map(user => (
                    <tr key={user._id}>
                      <Td theme={theme} dense={dense}>
                        <ActionIcon theme={theme} colorVal="#00AB55" onClick={() => handleOpenEdit(user)}>
                          <Edit2 size={16} />
                        </ActionIcon>
                        <ActionIcon theme={theme} colorVal="#ff4842" onClick={() => handleOpenDelete(user)}>
                          <Trash2 size={16} />
                        </ActionIcon>
                      </Td>
                      <CompanyNameTd theme={theme} dense={dense} onClick={() => handleOpenEdit(user)}>
                        {user.companyName}
                      </CompanyNameTd>
                      <Td theme={theme} dense={dense}>{user.username}</Td>
                      <Td theme={theme} dense={dense}>{user.firstName}</Td>
                      <Td theme={theme} dense={dense}>{user.lastName}</Td>
                      <Td theme={theme} dense={dense}>
                        <TypePill>{user.type}</TypePill>
                      </Td>
                      <Td theme={theme} dense={dense}>
                        <Pill active={user.status === 'Active'}>
                          {user.status}
                        </Pill>
                      </Td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <Td colSpan="7" style={{ textAlign: 'center', padding: '24px' }} theme={theme}>
                      No users found
                    </Td>
                  </tr>
                )}
              </tbody>
            </Table>

            <Footer theme={theme}>
              <FooterLeft theme={theme}>
                <span>Rows per page:</span>
                <select 
                  value={rowsPerPage} 
                  onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                  style={{ padding: '4px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </FooterLeft>
              <FooterRight>
                <PageInfo theme={theme}>
                  {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredUsers.length)} of ${filteredUsers.length}`}
                </PageInfo>
                <NavArrows>
                  <ArrowBtn 
                    theme={theme} 
                    disabled={currentPage === 1} 
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    ◀
                  </ArrowBtn>
                  <ArrowBtn 
                    theme={theme} 
                    disabled={currentPage === totalPages} 
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    ▶
                  </ArrowBtn>
                </NavArrows>
                <DenseToggle>
                  <Switch 
                    type="checkbox" 
                    checked={dense} 
                    onChange={(e) => setDense(e.target.checked)} 
                  />
                  <span>Dense</span>
                </DenseToggle>
              </FooterRight>
            </Footer>
          </TableWrapper>
        </>
      )}

      {/* ADD USER MODAL */}
      {addModalOpen && (
        <ModalOverlay>
          <ModalContent theme={theme}>
            <ModalHeader>
              <ModalTitle>{t('Add New User')}</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setAddModalOpen(false)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <Form onSubmit={handleAddSubmit}>
              <FormGroup>
                <Label theme={theme}>Company Name</Label>
                <Select 
                  name="company" 
                  value={formData.company || ''} 
                  onChange={handleFormChange} 
                  required 
                  theme={theme}
                >
                  <option value="">Select Company</option>
                  {companiesList.filter(comp => comp.status === 'Active').map(comp => (
                    <option key={comp._id} value={comp.firmName}>
                      {comp.firmName}
                    </option>
                  ))}
                </Select>
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Username</Label>
                <Input type="text" name="username" value={formData.username} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Password</Label>
                <Input type="password" name="password" value={formData.password} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>First Name</Label>
                <Input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Last Name</Label>
                <Input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Type</Label>
                <Select name="type" value={formData.type} onChange={handleFormChange} theme={theme}>
                  <option value="Retailer">Retailer</option>
                  <option value="Admin">Admin</option>
                  <option value="Driver">Driver</option>
                </Select>
              </FormGroup>
              <ButtonRow>
                <CancelBtn type="button" theme={theme} onClick={() => setAddModalOpen(false)}>{t('Cancel')}</CancelBtn>
                <PrimaryBtn type="submit" theme={theme}>{t('Add New')}</PrimaryBtn>
              </ButtonRow>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* EDIT USER MODAL */}
      {editModalOpen && (
        <ModalOverlay>
          <ModalContent theme={theme}>
            <ModalHeader>
              <ModalTitle>Edit User</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setEditModalOpen(false)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <Form onSubmit={handleEditSubmit}>
              <FormGroup>
                <Label theme={theme}>Company Name</Label>
                <Input type="text" name="companyName" value={formData.companyName} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Username</Label>
                <Input type="text" name="username" value={formData.username} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Password (leave blank to keep current)</Label>
                <Input type="password" name="password" value={formData.password} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>First Name</Label>
                <Input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Last Name</Label>
                <Input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Type</Label>
                <Select name="type" value={formData.type} onChange={handleFormChange} theme={theme}>
                  <option value="Retailer">Retailer</option>
                  <option value="Admin">Admin</option>
                  <option value="Driver">Driver</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Status</Label>
                <Select name="status" value={formData.status} onChange={handleFormChange} theme={theme}>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </FormGroup>
              <ButtonRow>
                <CancelBtn type="button" theme={theme} onClick={() => setEditModalOpen(false)}>{t('Cancel')}</CancelBtn>
                <PrimaryBtn type="submit" theme={theme}>{t('Save Changes')}</PrimaryBtn>
              </ButtonRow>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <ModalOverlay>
          <ModalContent theme={theme}>
            <ModalHeader>
              <ModalTitle>Delete User</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setDeleteModalOpen(false)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <p>Are you sure you want to delete user <strong>{currentUser?.username}</strong>?</p>
            <ButtonRow>
              <CancelBtn type="button" theme={theme} onClick={() => setDeleteModalOpen(false)}>{t('Cancel')}</CancelBtn>
              <PrimaryBtn style={{ backgroundColor: '#ff4842', boxShadow: 'none' }} onClick={handleDeleteSubmit} theme={theme}>
                Delete
              </PrimaryBtn>
            </ButtonRow>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Users;
