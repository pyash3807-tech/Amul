import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { Plus, Download, Search, X } from 'lucide-react';
import axios from 'axios';

const Container = styled.div`
  font-family: 'Public Sans', 'Inter', sans-serif;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
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
  padding: 10px 20px;
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 1.5px solid ${props => props.theme.primary};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
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

// EMPTY STATE
const EmptyCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 60px 40px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.02);
`;

const TruckEmoji = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
`;

const EmptyHeading = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: ${props => props.theme.text};
`;

const EmptySubtext = styled.p`
  font-size: 14px;
  color: ${props => props.theme.muted};
  margin: 0 0 24px 0;
`;

const AddBtn = styled.button`
  padding: 12px 24px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px ${props => `${props.theme.primary}24`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
  }
`;

// TABLE SYSTEM
const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  background-color: ${props => props.theme.card};
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
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

const Pill = styled.span`
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  background-color: ${props => props.active ? '#e2f9ec' : '#ffe8e6'};
  color: ${props => props.active ? '#00AB55' : '#ff4842'};
`;

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

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  margin-top: 6px;
  font-weight: 600;
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

const Vehicles = ({ setActiveTab, token }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    vehicleNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    vehicleType: 'Truck',
    isOwner: true,
    status: 'Active'
  });

  const fetchVehicles = async () => {
    try {
      const res = await axios.get('/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchVehicles();
    }
  }, [token]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/vehicles', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddModalOpen(false);
      fetchVehicles();
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding vehicle');
    }
  };

  // Filter & Paginate
  const filteredVehicles = vehicles.filter(v => {
    const term = searchTerm.toLowerCase();
    return (
      v.vehicleNo?.toLowerCase().includes(term) ||
      v.firstName?.toLowerCase().includes(term) ||
      v.lastName?.toLowerCase().includes(term) ||
      v.vehicleType?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredVehicles.length / rowsPerPage) || 1;
  const paginatedVehicles = filteredVehicles.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleOpenAdd = () => {
    setFormData({
      vehicleNo: '',
      firstName: '',
      middleName: '',
      lastName: '',
      vehicleType: 'Truck',
      isOwner: true,
      status: 'Active'
    });
    setAddModalOpen(true);
  };

  return (
    <Container>
      <Title theme={theme}>{t('Vehicles')}</Title>
      <Breadcrumb theme={theme}>
        <BreadLink theme={theme} onClick={() => setActiveTab('dashboard')}>Dashboard</BreadLink>
        <span>•</span>
        <span>Vehicles</span>
      </Breadcrumb>

      {vehicles.length > 0 && (
        <ActionsRow>
          <LeftActions>
            <OutlineBtn theme={theme} onClick={handleOpenAdd}>
              <Plus size={16} />
              {t('Add New')}
            </OutlineBtn>
            <OutlineBtn theme={theme} onClick={() => alert("Import Vehicles triggered!")}>
              <Download size={16} />
              {t('Import Vehicles')}
            </OutlineBtn>
          </LeftActions>
          <SearchWrapper>
            <SearchIconWrapper theme={theme}>
              <Search size={18} />
            </SearchIconWrapper>
            <SearchInput 
              type="text" 
              placeholder={t('Search')} 
              value={searchTerm} 
              onChange={handleSearch}
              theme={theme}
            />
          </SearchWrapper>
        </ActionsRow>
      )}

      {vehicles.length === 0 ? (
        <EmptyCard theme={theme}>
          <TruckEmoji>🚛</TruckEmoji>
          <EmptyHeading theme={theme}>{t('No Vehicles Found')}</EmptyHeading>
          <EmptySubtext theme={theme}>{t('Add first vehicle')}</EmptySubtext>
          <AddBtn theme={theme} onClick={handleOpenAdd}>
            + Add Vehicle
          </AddBtn>
        </EmptyCard>
      ) : (
        <TableWrapper theme={theme}>
          <Table>
            <thead>
              <tr>
                <Th theme={theme} dense={dense}>Vehicle No</Th>
                <Th theme={theme} dense={dense}>First Name</Th>
                <Th theme={theme} dense={dense}>Middle Name</Th>
                <Th theme={theme} dense={dense}>Last Name</Th>
                <Th theme={theme} dense={dense}>Vehicle Type</Th>
                <Th theme={theme} dense={dense}>Is Owner</Th>
                <Th theme={theme} dense={dense}>Status</Th>
              </tr>
            </thead>
            <tbody>
              {paginatedVehicles.map(v => (
                <tr key={v._id}>
                  <Td theme={theme} dense={dense}>{v.vehicleNo}</Td>
                  <Td theme={theme} dense={dense}>{v.firstName}</Td>
                  <Td theme={theme} dense={dense}>{v.middleName}</Td>
                  <Td theme={theme} dense={dense}>{v.lastName}</Td>
                  <Td theme={theme} dense={dense}>{v.vehicleType}</Td>
                  <Td theme={theme} dense={dense}>{v.isOwner ? 'Yes' : 'No'}</Td>
                  <Td theme={theme} dense={dense}>
                    <Pill active={v.status === 'Active'}>
                      {v.status}
                    </Pill>
                  </Td>
                </tr>
              ))}
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
                {`${(currentPage - 1) * rowsPerPage + 1}-${Math.min(currentPage * rowsPerPage, filteredVehicles.length)} of ${filteredVehicles.length}`}
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
      )}

      {/* ADD VEHICLE MODAL */}
      {addModalOpen && (
        <ModalOverlay>
          <ModalContent theme={theme}>
            <ModalHeader>
              <ModalTitle>{t('Add Vehicle')}</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setAddModalOpen(false)}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <Form onSubmit={handleAddSubmit}>
              <FormGroup>
                <Label theme={theme}>Vehicle No</Label>
                <Input type="text" name="vehicleNo" value={formData.vehicleNo} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>First Name</Label>
                <Input type="text" name="firstName" value={formData.firstName} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Middle Name</Label>
                <Input type="text" name="middleName" value={formData.middleName} onChange={handleFormChange} theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Last Name</Label>
                <Input type="text" name="lastName" value={formData.lastName} onChange={handleFormChange} required theme={theme} />
              </FormGroup>
              <FormGroup>
                <Label theme={theme}>Vehicle Type</Label>
                <Select name="vehicleType" value={formData.vehicleType} onChange={handleFormChange} theme={theme}>
                  <option value="Truck">Truck</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Bike">Bike</option>
                  <option value="Auto">Auto</option>
                  <option value="Van">Van</option>
                </Select>
              </FormGroup>
              <FormGroup>
                <CheckboxLabel>
                  <input 
                    type="checkbox" 
                    name="isOwner" 
                    checked={formData.isOwner} 
                    onChange={handleFormChange} 
                  />
                  Is Owner
                </CheckboxLabel>
              </FormGroup>
              <ButtonRow>
                <CancelBtn type="button" theme={theme} onClick={() => setAddModalOpen(false)}>{t('Cancel')}</CancelBtn>
                <PrimaryBtn type="submit" theme={theme}>{t('Add Vehicle')}</PrimaryBtn>
              </ButtonRow>
            </Form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default Vehicles;
