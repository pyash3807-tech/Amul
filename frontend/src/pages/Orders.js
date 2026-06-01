import React, { useContext, useEffect, useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from '../context/ThemeContext';
import { 
  Calendar, 
  Sun, 
  Moon, 
  FileText, 
  Phone, 
  ChevronLeft, 
  Save, 
  FileSpreadsheet,
  Plus,
  Truck,
  DollarSign,
  X,
  Search,
  RotateCw
} from 'lucide-react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Container = styled.div`
  font-family: 'Public Sans', 'Inter', sans-serif;
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

const EditControlsCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const SelectShiftWrapper = styled.div`
  position: relative;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  background-color: transparent;
  min-width: 140px;

  select {
    border: none;
    background: transparent;
    color: ${props => props.theme.text};
    font-size: 14px;
    font-weight: 600;
    width: 100%;
    outline: none;
    cursor: pointer;
    padding-right: 20px;
    appearance: none;
  }

  &::after {
    content: '▼';
    font-size: 10px;
    color: ${props => props.theme.muted};
    position: absolute;
    right: 12px;
    pointer-events: none;
  }
`;

const SolidSummaryBtn = styled.button`
  padding: 10px 20px;
  background-color: #00AB55;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(0, 171, 85, 0.24);
  transition: all 0.2s;

  &:hover {
    background-color: #008f47;
  }
`;

const InlineBadgeRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
  margin-left: auto;

  @media (max-width: 900px) {
    margin-left: 0;
    width: 100%;
  }
`;

const RetailerListPanel = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  margin-top: 12px;
`;

const RetailerRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: ${props => props.isLast ? 'none' : `1px solid ${props.theme.border}`};
  background-color: transparent;
  transition: background-color 0.15s;

  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'};
  }
`;

const CircleIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#36B37E' : '#FF4842'};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SelectDateWrapper = styled.div`
  position: relative;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  background-color: transparent;

  .react-datepicker-wrapper {
    width: 100px;
  }

  .react-datepicker__input-container input {
    border: none;
    background: transparent;
    color: ${props => props.theme.text};
    font-size: 14px;
    font-weight: 600;
    width: 100%;
    padding: 0;
    cursor: pointer;
    &:focus {
      outline: none;
    }
  }
`;

const FloatingLabel = styled.span`
  position: absolute;
  top: -8px;
  left: 12px;
  background-color: ${props => props.theme.card};
  padding: 0 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.muted};
`;

const SwitchContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
`;

const SwitchTrack = styled.div`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background-color: ${props => props.active ? props.theme.primary : props.theme.border};
  position: relative;
  transition: background-color 0.2s;
`;

const SwitchThumb = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 3px;
  left: ${props => props.active ? '19px' : '3px'};
  transition: left 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
`;

const CrateOrderBtn = styled.button`
  padding: 8px 16px;
  background-color: transparent;
  color: ${props => props.theme.primary};
  border: 1px solid ${props => props.theme.primary};
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => `${props.theme.primary}10`};
  }
`;

const EditSearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
`;

const EditSearchInput = styled.input`
  width: 100%;
  padding: 8px 12px 8px 36px;
  font-size: 14px;
  border-radius: 20px;
  border: 1px solid ${props => props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  outline: none;

  &:focus {
    border-color: ${props => props.theme.primary};
  }
`;

const EditSearchIconWrapper = styled.div`
  position: absolute;
  left: 12px;
  color: ${props => props.theme.muted};
  display: flex;
  align-items: center;
`;

const ProductCardColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

const ShiftCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const ShiftRateHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.muted};
  margin-bottom: 8px;
`;

const RateValue = styled.span`
  font-size: 11px;
  color: ${props => props.theme.muted};
  font-weight: 500;
`;

const ShiftInputWrapper = styled.div`
  position: relative;
  margin-top: 6px;
`;

const ShiftInputLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 10px;
  background-color: ${props => props.theme.card};
  padding: 0 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.focused ? props.theme.primary : props.theme.muted};
  transition: color 0.2s;
`;

const ShiftInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  font-size: 15px;
  font-weight: 600;
  border-radius: 8px;
  border: 1px solid ${props => props.focused ? props.theme.primary : props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  outline: none;

  &:focus {
    border-color: ${props => props.theme.primary};
  }
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const OutlineBadge = styled.div`
  border: 1.5px solid ${props => props.colorVal || props.theme.primary};
  color: ${props => props.colorVal || props.theme.primary};
  background-color: ${props => props.bgColor || 'transparent'};
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
`;

const CenteredHeader = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: ${props => props.theme.text};
  text-align: center;
  margin-top: 10px;
  margin-bottom: 24px;
`;

const POInputsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: center;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const POInputFieldWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

const POInputContainer = styled.div`
  position: relative;
  flex: 1;
`;

const POLabel = styled.label`
  position: absolute;
  top: -8px;
  left: 10px;
  background-color: ${props => props.theme.card};
  padding: 0 4px;
  font-size: 11px;
  font-weight: 600;
  color: ${props => props.theme.muted};
`;

const POInput = styled.input`
  width: 100%;
  padding: 10px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  outline: none;

  &:focus {
    border-color: ${props => props.theme.primary};
  }
`;

const SummaryCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 16px;
  padding: 24px;
  margin-top: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const SummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin-top: 0;
  margin-bottom: 20px;
`;

const CleanTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const CleanTh = styled.th`
  padding: 12px 16px;
  background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
  color: ${props => props.theme.muted};
  font-size: 13px;
  font-weight: 700;
  border: none;
  text-align: ${props => props.align || 'left'};
`;

const CleanTd = styled.td`
  padding: 16px;
  font-size: 14px;
  color: ${props => props.theme.text};
  font-weight: ${props => props.bold ? '700' : '400'};
  border-bottom: ${props => props.isLast ? 'none' : `1px solid ${props.theme.border}`};
  text-align: ${props => props.align || 'left'};
`;

const BottomBar = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 16px 24px;
  display: flex;
  justify-content: flex-start;
  margin-top: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const GreenSaveBtn = styled.button`
  padding: 12px 24px;
  background-color: #00AB55;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 171, 85, 0.24);
  transition: all 0.2s;

  &:hover {
    background-color: #008f47;
    box-shadow: 0 6px 16px rgba(0, 171, 85, 0.32);
  }
`;

// CONTROLS ROW
const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 8px 12px;

  .react-datepicker-wrapper {
    width: 120px;
  }
  .react-datepicker__input-container input {
    border: none;
    background: transparent;
    color: ${props => props.theme.text};
    font-size: 14px;
    font-weight: 600;
    width: 100%;
    &:focus {
      outline: none;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  padding: 4px;
`;

const ShiftBtn = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: ${props => props.active ? props.theme.primary : 'transparent'};
  color: ${props => props.active ? '#fff' : props.theme.text};
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.active ? props.theme.primary : props.theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'};
  }
`;

const SummaryBtn = styled.button`
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

const OutlineBtn = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  color: ${props => props.theme.text};
  border: 1.5px solid ${props => props.theme.border};
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: ${props => props.theme.border};
  }
`;

// STATS ROW
const StatsRow = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
`;

const StatBadge = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  color: ${props => props.theme.text};
  box-shadow: 0 2px 6px rgba(0,0,0,0.02);
`;

// RETAILER LIST
const RetailerGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RetailerCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 16px 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;

  &:hover {
    transform: translateY(-1px);
    border-color: ${props => props.theme.primary};
  }
`;

const RetailerName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${props => props.theme.text};
`;

const RetailerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ShiftIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: ${props => props.active ? props.colorVal : props.theme.isDark ? '#2d3748' : '#e9ecef'};
  color: ${props => props.active ? '#fff' : props.theme.muted};
  font-size: 11px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.colorVal || props.theme.text};
  cursor: pointer;
  padding: 6px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: ${props => props.theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'};
  }
`;

// EDIT ORDER LAYOUT
const BackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.text};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  border: 1px solid ${props => props.theme.border};
  background-color: ${props => props.theme.card};

  &:hover {
    background-color: ${props => props.theme.border};
  }
`;

const OrderHeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${props => props.theme.text};
  margin: 0;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ProductCard = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
`;

const ProductName = styled.h4`
  font-size: 15px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 6px;
  color: ${props => props.theme.text};
`;

const PrevRef = styled.div`
  font-size: 11px;
  color: ${props => props.theme.muted};
  margin-bottom: 16px;
  font-weight: 500;
`;

const QtyInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`;

const QtyLabel = styled.label`
  font-size: 12px;
  font-weight: 600;
  color: ${props => props.active ? props.theme.primary : props.theme.muted};
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const QtyInput = styled.input`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid ${props => props.active ? props.theme.primary : props.theme.border};
  background-color: transparent;
  color: ${props => props.theme.text};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary};
  }
`;

const POSection = styled.div`
  background-color: ${props => props.theme.card};
  border: 1px solid ${props => props.theme.border};
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 32px;
`;

const POTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 16px;
  color: ${props => props.theme.text};
`;

const SummaryTableWrapper = styled.div`
  margin-bottom: 32px;
  border: 1px solid ${props => props.theme.border};
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.card};
`;

const SummaryTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const STTh = styled.th`
  padding: 12px 16px;
  background-color: ${props => props.theme.isDark ? '#2d3748' : '#f4f6f8'};
  color: ${props => props.theme.muted};
  font-size: 12px;
  font-weight: 700;
  border-bottom: 1px solid ${props => props.theme.border};
`;

const STTd = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  border-bottom: 1px solid ${props => props.theme.border};
  color: ${props => props.theme.text};
  font-weight: ${props => props.bold ? '700' : '400'};
`;

const SaveOrderBtn = styled.button`
  padding: 14px 28px;
  background-color: ${props => props.theme.primary};
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 16px ${props => `${props.theme.primary}24`};
  transition: all 0.2s;

  &:hover {
    filter: brightness(0.95);
    box-shadow: 0 10px 20px ${props => `${props.theme.primary}32`};
  }
`;

const PrintStyle = createGlobalStyle`
  @media print {
    body {
      background-color: #fff !important;
      color: #000 !important;
    }
    #root > div {
      display: block !important;
    }
    aside, header, nav, button, .no-print {
      display: none !important;
    }
    .print-area {
      position: absolute;
      left: 0;
      top: 0;
      width: 100% !important;
      height: auto !important;
      padding: 0 !important;
      margin: 0 !important;
      box-shadow: none !important;
      background: #fff !important;
    }
  }
`;

const PrintContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  color: #000;
  z-index: 3000;
  padding: 40px;
  overflow-y: auto;
  box-sizing: border-box;

  @media print {
    padding: 0;
  }
`;

const PrintBtn = styled.button`
  padding: 10px 20px;
  background-color: #2065D1;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(32, 101, 209, 0.24);
  margin-right: 12px;
  &:hover {
    filter: brightness(0.95);
  }
`;

const CloseReportBtn = styled.button`
  padding: 10px 20px;
  background-color: #637381;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    filter: brightness(0.95);
  }
`;

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

const RupeeIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', verticalAlign: 'middle' }}>
    <path d="M6 3h12M6 8h12M6 3a6 6 0 0 1 6 6H6m6 0a6 6 0 0 1-6 6m6-6l-6 6" />
  </svg>
);

const BAG_MULTIPLIERS = {
  'Taaza 24x500': 24,
  'Chay Mazza 24x500': 24,
  'Chay Mazza 12x 1': 12,
  'Taaza 2x6': 12,
  'Gold 24x500': 24,
  'Gold 2x6': 12,
  'Buffalo 24x500': 24,
  'Buffalo 2x6': 12,
  'Tea Spe. 12x 1': 12,
  'Taaza 60x 150': 60,
  'Cow 24x500': 24,
  'Gopal BM 24x 300': 24,
  'Gopal BM 20x 480': 20,
  'G Sour B.M. 18x 530': 18,
  'G Dahi 30x 400': 30,
  'G Dahi 12x 1': 12,
  'G Dahi 2x5': 10,
  'G Dahi 48x 100-C': 48,
  'G Dahi 22x 200-C': 22,
  'Amul PB BM 30x 400': 30,
  'Amul PB BM 16x 650': 16,
  'Amul BM 2x 6': 12,
  'AM Dahi 30x 380': 30,
  'AM Dahi 12x 1': 12,
  'AM Dahi 2x5': 10,
  'AM Dahi 48x 80-C': 48,
  'AM Dahi 28x 200-C': 28,
  'AC Dahi 16x 700': 16,
  'AC Dahi 2x 5': 10,
  'AM Dahi 6x 1-B': 6,
  'AF Paneer 60x 100': 60,
  'AF Paneer 45x 200': 45,
  'AF Paneer 14x 1': 14
};

const GUJARATI_PRODUCT_NAMES = {
  'Taaza 24x500': 'તાજા ૨૪x ૫૦૦',
  'Chay Mazza 24x500': 'ચાય મઝા ૨૪x ૫૦૦',
  'Chay Mazza 12x 1': 'ચાય મઝા ૧૨x ૧',
  'Taaza 2x6': 'તાજા ૨x ૬',
  'Gold 24x500': 'ગોલ્ડ ૨૪x ૫૦૦',
  'Gold 2x6': 'ગોલ્ડ ૨x ૬',
  'Buffalo 24x500': 'બફેલો ૨૪x ૫૦૦',
  'Buffalo 2x6': 'બફેલો ૨x ૬',
  'Tea Spe. 12x 1': 'ટી સ્પે. ૧૨x ૧',
  'Taaza 60x 150': 'તાજા ૬૦x ૧૫૦',
  'Cow 24x500': 'ગાય ૨૪x ૫૦૦',
  'Gopal BM 24x 300': 'ગોપાલ છાસ ૨૪x ૩૦૦',
  'Gopal BM 20x 480': 'ગોપાલ છાસ ૨૦x ૪૮૦',
  'G Sour B.M. 18x 530': 'ખાટી છાસ ૧૮x ૫૩૦',
  'G Dahi 30x 400': 'ગોપાલ દહીં ૩૦x ૪૦૦',
  'G Dahi 12x 1': 'ગોપાલ દહીં ૧૨x ૧',
  'G Dahi 2x5': 'ગોપાલ દહીં ૨x ૫',
  'G Dahi 48x 100-C': 'ગોપાલ દહીં ૪૮x ૧૦૦',
  'G Dahi 22x 200-C': 'ગોપાલ દહીં ૨૨x ૨૦૦',
  'Amul PB BM 30x 400': 'અ છાસ ૩૦x ૪૦૦',
  'Amul PB BM 16x 650': 'અ છાસ ૧૬x ૬૫૦',
  'Amul BM 2x 6': 'અ છાસ ૨x ૬',
  'AM Dahi 30x 380': 'અમ દહીં ૩૦x ૩૮ો',
  'AM Dahi 12x 1': 'અમ દહીં ૧૨x ૧',
  'AM Dahi 2x5': 'અમ દહીં ૨x ૫',
  'AM Dahi 48x 80-C': 'અમ દહીં ૪૮x ૮૦',
  'AM Dahi 28x 200-C': 'અમ દહીં ૨૮x ૨૦૦ -ક',
  'AC Dahi 16x 700': 'એસી દહીં ૧૬x ૭૦૦',
  'AC Dahi 2x 5': 'એસી દહીં ૨x ૫',
  'AM Dahi 6x 1-B': 'અમ દહીં ૬x ૧ -બ',
  'AF Paneer 60x 100': 'અફે પનીર ૬૦x ૧૦૦',
  'AF Paneer 45x 200': 'અફે પનીર ૪૫x ૨૦૦',
  'AF Paneer 14x 1': 'અફે પનીર ૧૪x ૧'
};

const DELIVERY_HEADER_WRAPS = {
  'Taaza 24x500': ['તાજા', '૨૪x', '૫૦૦'],
  'Gold 24x500': ['ગોલ્ડ', '૨૪x', '૦૦'],
  'Cow 24x500': ['ગાય', '૨૪x', '૦૦'],
  'Amul PB BM 30x 400': ['અ', 'છાસ', '૩૦x', '૪૦૦'],
  'AM Dahi 30x 380': ['અમ', 'દહીં', '૩૦x', '૩૮૦'],
  'AM Dahi 12x 1': ['અમ', 'દહીં', '૧૨x', '૧'],
  'AM Dahi 28x 200-C': ['અમ', 'દહીં', '૨૮x', '૨૦૦', '-ક'],
  'AM Dahi 6x 1-B': ['અમ', 'દહીં', '૬x', '૧', '-બ']
};

const PRODUCT_SORT_ORDER = [
  'Taaza 24x500',
  'Chay Mazza 24x500',
  'Chay Mazza 12x 1',
  'Taaza 2x6',
  'Gold 24x500',
  'Gold 2x6',
  'Buffalo 24x500',
  'Buffalo 2x6',
  'Tea Spe. 12x 1',
  'Taaza 60x 150',
  'Cow 24x500',
  'Gopal BM 24x 300',
  'Gopal BM 20x 480',
  'G Sour B.M. 18x 530',
  'G Dahi 30x 400',
  'G Dahi 12x 1',
  'G Dahi 2x5',
  'G Dahi 48x 100-C',
  'G Dahi 22x 200-C',
  'Amul PB BM 30x 400',
  'Amul PB BM 16x 650',
  'Amul BM 2x 6',
  'AM Dahi 30x 380',
  'AM Dahi 12x 1',
  'AM Dahi 2x5',
  'AM Dahi 48x 80-C',
  'AM Dahi 28x 200-C',
  'AC Dahi 16x 700',
  'AC Dahi 2x 5',
  'AM Dahi 6x 1-B',
  'AF Paneer 60x 100',
  'AF Paneer 45x 200',
  'AF Paneer 14x 1'
];

const INVOICE_PRODUCT_DETAILS = {
  'Taaza 24x500': { hsn: '040120', mrp: 29, distributorRate: 661.56, retailerRate: 674.76 },
  'Gold 24x500': { hsn: '040140', mrp: 35, distributorRate: 804.96, retailerRate: 818.40 },
  'Buffalo 24x500': { hsn: '040120', mrp: 36, distributorRate: 821.28, retailerRate: 838.08 },
  'Cow 24x500': { hsn: '040120', mrp: 30, distributorRate: 682.80, retailerRate: 697.20 },
  'Amul PB BM 30x 400': { hsn: '040390', mrp: 15, distributorRate: 359.15, retailerRate: 385.71 },
  'AM Dahi 30x 380': { hsn: '040390', mrp: 35, distributorRate: 845.93, retailerRate: 900.00 },
  'AM Dahi 12x 1': { hsn: '040390', mrp: 80, distributorRate: 811.57, retailerRate: 845.71 },
  'AM Dahi 28x 200-C': { hsn: '040390', mrp: 25, distributorRate: 543.27, retailerRate: 583.33 },
  'AM Dahi 6x 1-B': { hsn: '040390', mrp: 115, distributorRate: 552.68, retailerRate: 591.43 },
  'AF Paneer 60x 100': { hsn: '040690', mrp: 47, distributorRate: 2395.66, retailerRate: 2515.44 },
  'AF Paneer 45x 200': { hsn: '040690', mrp: 92, distributorRate: 3517.03, retailerRate: 3692.88 },
  'AF Paneer 14x 1': { hsn: '040690', mrp: 450, distributorRate: 5400.00, retailerRate: 5600.00 }
};;

const PRODUCT_INFO_FOR_HEADER = {
  'Taaza 24x500': { rateStr: '674.76', mrpStr: '29' },
  'Gold 24x500': { rateStr: '818.40', mrpStr: '35' },
  'Buffalo 24x500': { rateStr: '838.08', mrpStr: '36' },
  'Cow 24x500': { rateStr: '697.20', mrpStr: '30' },
  'Amul PB BM 30x 400': { rateStr: '405', mrpStr: '15' },
  'AM Dahi 30x 380': { rateStr: '945', mrpStr: '35' },
  'AM Dahi 12x 1': { rateStr: '888', mrpStr: '80' },
  'AM Dahi 28x 200-C': { rateStr: '612.5', mrpStr: '25' },
  'AM Dahi 6x 1-B': { rateStr: '621', mrpStr: '115' },
  'AF Paneer 60x 100': { rateStr: '2515.44', mrpStr: '47' },
  'AF Paneer 45x 200': { rateStr: '3692.88', mrpStr: '92' }
};

const DISTRIBUTOR_INFO = {
  companyCode: '1007459M',
  firmName: 'Yash Milk Marketing-Rajkot-1007459M',
  firmNameGujarati: 'યશ મિલ્ક માર્કેટિંગ-રાજકોટ-૧૦૦૭૪૫૯M',
  mobile: '9016624262',
  address: 'Bharti Nagar, Street No.4, Opp. Chamunda Pan, Gandhigram, 150 Feet Ring Road, Rajkot - 360005, Gujarat - India',
  gst: '24AWEPB9363P1Z4',
  pan: 'AWEPB9363P',
  fssai: '10714030000100',
  placeOfSupply: '24 - Gujarat'
};

const SUPPLIER_INFO = {
  name: 'KPS Report',
  address: '123 Milk Street, Main Road, Rajkot, Rajkot - 360001, Gujarat - India',
  fssai: '12345678901234',
  placeOfSupply: 'Rajkot Region',
  gst: '24ABCDE1234F1Z5',
  pan: 'ABCDE1234F'
};

const BANK_DETAILS = {
  bankName: 'State Bank of India',
  branch: 'Rajkot Main',
  accountNumber: '123456789012345',
  ifsc: 'SBIN0001234',
  upi: 'dairymitra@upi'
};

const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if ((num = num.toString()).length > 9) return 'overflow';
  let n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
  if (!n) return '';
  let str = '';
  str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
  str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
  str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
  str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
  str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Rupees ' : '';
  return str ? str + 'Only' : 'Zero Rupees Only';
};

const DEFAULT_PRODUCTS = [
  { name: 'Taaza 24x500', rate: 23.20 },
  { name: 'Gold 24x500', rate: 27.00 },
  { name: 'Buffalo 24x500', rate: 28.50 },
  { name: 'Taaza 6x1L', rate: 55.00 },
  { name: 'Gold 6x1L', rate: 65.00 }
];

const toGujaratiDigits = (num) => {
  const gujaratiDigits = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
  return String(num).replace(/[0-9]/g, (w) => gujaratiDigits[+w]);
};

const getFullCommercialName = (name) => {
  const mapping = {
    'Taaza 24x500': 'Amul Taaza 24x500 Ml Pouch',
    'Gold 24x500': 'Amul Gold 24x500 Ml Pouch',
    'Buffalo 24x500': 'Amul Buffalo Milk 24x500 Ml Pouch',
    'Cow 24x500': 'Amul Cow Milk 24x500 Ml Pouch',
    'Amul PB BM 30x 400': 'Amul Probiotic Buttermilk 30x400 Ml Pouch',
    'AM Dahi 30x 380': 'Amul Masti Dahi Pouch 30x380 Gm Pouch',
    'AM Dahi 12x 1': 'Amul Masti Dahi Pouch 12x1 Kg Pouch',
    'AM Dahi 28x 200-C': 'Amul Masti Dahi Cup 28x200 Gm Cup',
    'AM Dahi 6x 1-B': 'Amul Masti Dahi 6x1 Bucket',
    'AF Paneer 60x 100': 'Amul Fresh Paneer 60x100 Gm Pouch',
    'AF Paneer 45x 200': 'Amul Fresh Paneer 45x200 Gm Pouch',
    'AF Paneer 14x 1': 'Amul Fresh Paneer 14x1 Kg Pouch'
  };
  return mapping[name] || name;
};

// Helper to return beautiful PNG illustrations for Amul products
const getProductIllustration = (name, size = 64) => {
  const lower = name.toLowerCase();
  let src = '/assets/amul_taaza.png'; // Default fallback
  
  if (lower.includes('taaza')) {
    src = '/assets/amul_taaza.png';
  } else if (lower.includes('gold')) {
    src = '/assets/amul_gold.png';
  } else if (lower.includes('buffalo')) {
    src = '/assets/amul_buffalo.png';
  } else if (lower.includes('cow')) {
    src = '/assets/amul_cow.png';
  } else if (lower.includes('mazza')) {
    src = '/assets/amul_mazza.png';
  } else if (lower.includes('dahi') || lower.includes('curd')) {
    src = '/assets/amul_dahi.png';
  } else if (lower.includes('bm') || lower.includes('sour') || lower.includes('butter')) {
    src = '/assets/amul_buttermilk.png';
  } else if (lower.includes('paneer')) {
    src = '/assets/amul_paneer.png';
  } else if (lower.includes('tea') || lower.includes('spe.')) {
    src = '/assets/amul_taaza.png'; // fallback or similar
  }

  return (
    <img 
      src={src} 
      alt={name} 
      style={{ 
        width: `${size}px`, 
        height: `${size}px`, 
        objectFit: 'contain',
        filter: 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.15))' 
      }} 
    />
  );
};

const Orders = ({ setActiveTab, token }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();

  const [selectedDate, setSelectedDate] = useState(new Date('2026-05-31')); // Lock default to 2026-05-31
  const [activeShift, setActiveShift] = useState('All');
  const [orders, setOrders] = useState([]);
  const [retailers, setRetailers] = useState([]);
  const [companies, setCompanies] = useState([]);

  // Report configurations state
  const [reportView, setReportView] = useState(null); // 'delivery', 'collection', 'purchase'
  const [reportData, setReportData] = useState(null);
  const [reportMeta, setReportMeta] = useState({});
  const [collectionModal, setCollectionModal] = useState({
    isOpen: false,
    retailerName: null,
    fromDate: new Date('2026-05-31'),
    toDate: new Date('2026-05-31')
  });
  
  // Navigation State
  const [editingOrder, setEditingOrder] = useState(null);
  const [editProductSearch, setEditProductSearch] = useState('');
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  // For previous day references
  const [allPastOrders, setAllPastOrders] = useState([]);

  const dateStr = selectedDate.toISOString().split('T')[0];

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/api/orders?date=${dateStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllPastOrders = async () => {
    try {
      const res = await axios.get('/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllPastOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('/api/companies', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRetailers = async () => {
    try {
      const res = await axios.get('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = res.data.filter(u => u.type === 'Retailer');
      setRetailers(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
      fetchRetailers();
      fetchAllPastOrders();
      fetchCompanies();
    }
  }, [selectedDate, token]);

  const handleEditClick = (retailerName) => {
    setEditProductSearch('');
    setShowAllProducts(false);
    
    const existing = orders.find(o => o.retailerName === retailerName);
    const company = companies.find(c => c.firmName === retailerName);
    
    let initialProducts = [];
    if (company && company.products && company.products.length > 0) {
      initialProducts = company.products.map(p => ({
        name: p.name,
        baseRate: p.baseRate,
        morningRate: p.morningRate,
        eveningRate: p.eveningRate,
        morningQty: 0,
        eveningQty: 0,
        selected: p.selected,
        rate: p.baseRate + p.morningRate
      }));
    } else {
      initialProducts = DEFAULT_PRODUCTS.map(p => ({
        name: p.name,
        baseRate: p.rate,
        morningRate: 0,
        eveningRate: 0,
        morningQty: 0,
        eveningQty: 0,
        selected: true,
        rate: p.rate
      }));
    }

    if (existing) {
      const mergedProducts = initialProducts.map(ip => {
        const ep = existing.products.find(ep => ep.name === ip.name);
        return {
          ...ip,
          morningQty: ep ? ep.morningQty : 0,
          eveningQty: ep ? ep.eveningQty : 0
        };
      });

      // Append any products in existing order that are missing from company products
      existing.products.forEach(ep => {
        if (!mergedProducts.some(mp => mp.name === ep.name)) {
          mergedProducts.push({
            name: ep.name,
            baseRate: ep.rate,
            morningRate: 0,
            eveningRate: 0,
            morningQty: ep.morningQty,
            eveningQty: ep.eveningQty,
            selected: true,
            rate: ep.rate
          });
        }
      });

      setEditingOrder({
        ...existing,
        products: mergedProducts
      });
    } else {
      setEditingOrder({
        date: dateStr,
        retailerName,
        products: initialProducts,
        morningPONumber: '',
        eveningPONumber: '',
        shift: 'All',
        status: 'Pending'
      });
    }
  };

  // Previous Day lookup
  const getPrevDayRef = (retailerName, prodName) => {
    const prevDate = new Date(selectedDate.getTime() - 24 * 60 * 60 * 1000);
    const prevDateStr = prevDate.toISOString().split('T')[0];
    const prevOrder = allPastOrders.find(o => o.retailerName === retailerName && o.date === prevDateStr);
    if (prevOrder) {
      const p = prevOrder.products.find(prod => prod.name === prodName);
      if (p) {
        return `Prev: M=${p.morningQty || 0}, E=${p.eveningQty || 0}`;
      }
    }
    return 'Prev: M=0, E=0';
  };

  const handleQtyChange = (prodIndex, shift, val) => {
    const num = parseInt(val) || 0;
    const updatedProds = [...editingOrder.products];
    updatedProds[prodIndex] = {
      ...updatedProds[prodIndex],
      [shift]: num
    };

    const totalAmount = updatedProds.reduce((sum, p) => {
      const morningRateFinal = (p.baseRate || p.rate || 0) + (p.morningRate || 0);
      const eveningRateFinal = (p.baseRate || p.rate || 0) + (p.eveningRate || 0);
      return sum + ((p.morningQty || 0) * morningRateFinal) + ((p.eveningQty || 0) * eveningRateFinal);
    }, 0);

    setEditingOrder(prev => ({
      ...prev,
      products: updatedProds,
      totalAmount: parseFloat(totalAmount.toFixed(2))
    }));
  };

  const handleSaveOrder = async () => {
    try {
      if (editingOrder._id) {
        await axios.put(`/api/orders/${editingOrder._id}`, editingOrder, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/orders', editingOrder, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setEditingOrder(null);
      fetchOrders();
      fetchAllPastOrders();
    } catch (err) {
      alert('Failed to save order. Please check inputs.');
    }
  };

  // Calculations for Order Summary in Editing view
  const calculateShiftTotals = () => {
    if (!editingOrder) return { morningCrates: 0, morningAmt: 0, eveningCrates: 0, eveningAmt: 0 };
    let morningCrates = 0;
    let morningAmt = 0;
    let eveningCrates = 0;
    let eveningAmt = 0;

    editingOrder.products.forEach(p => {
      const morningRateFinal = (p.baseRate || p.rate || 0) + (p.morningRate || 0);
      const eveningRateFinal = (p.baseRate || p.rate || 0) + (p.eveningRate || 0);
      morningCrates += p.morningQty || 0;
      morningAmt += (p.morningQty || 0) * morningRateFinal;
      eveningCrates += p.eveningQty || 0;
      eveningAmt += (p.eveningQty || 0) * eveningRateFinal;
    });

    return {
      morningCrates,
      morningAmt: parseFloat(morningAmt.toFixed(2)),
      eveningCrates,
      eveningAmt: parseFloat(eveningAmt.toFixed(2)),
      totalCrates: morningCrates + eveningCrates,
      totalAmt: parseFloat((morningAmt + eveningAmt).toFixed(2))
    };
  };

  const shiftTotals = calculateShiftTotals();

  // Stats badge totals on List view
  const getListStats = () => {
    const activeOrders = orders.filter(o => {
      const comp = companies.find(c => c.firmName === o.retailerName);
      return comp ? comp.status === 'Active' : true;
    });
    let total = activeOrders.length;
    let morning = 0;
    let evening = 0;

    activeOrders.forEach(o => {
      const hasM = o.products.some(p => p.morningQty > 0);
      const hasE = o.products.some(p => p.eveningQty > 0);
      if (hasM) morning++;
      if (hasE) evening++;
    });

    return { total, morning, evening };
  };

  const listStats = getListStats();

  const handlePDFExport = (order) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Yash Milk Marketing - KPS Report", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Retailer: ${order.retailerName}`, 14, 28);
    doc.text(`Date: ${order.date}`, 14, 34);
    doc.text(`Morning PO: ${order.morningPONumber || '-'}`, 120, 28);
    doc.text(`Evening PO: ${order.eveningPONumber || '-'}`, 120, 34);

    // Table
    const tableHeaders = [["Product", "Morning Qty", "Evening Qty", "Rate", "Amount"]];
    const tableData = order.products.map(p => {
      const amt = ((p.morningQty || 0) + (p.eveningQty || 0)) * p.rate;
      return [
        p.name,
        p.morningQty || 0,
        p.eveningQty || 0,
        `INR ${p.rate.toFixed(2)}`,
        `INR ${amt.toFixed(2)}`
      ];
    });

    doc.autoTable({
      head: tableHeaders,
      body: tableData,
      startY: 42,
      theme: 'grid',
      headStyles: { fillStyle: '#00AB55' }
    });

    const finalY = doc.previousAutoTable.finalY + 15;
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total Amount: INR ${order.totalAmount.toFixed(2)}`, 14, finalY);
    
    // Signature
    doc.setLineWidth(0.5);
    doc.line(140, finalY + 15, 190, finalY + 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Authorized Signature", 148, finalY + 20);

    doc.save(`Order_${order.retailerName}_${order.date}.pdf`);
  };

  const handleCall = (retailer) => {
    // Standard tel trigger
    window.location.href = `tel:${retailer.mobile1 || '9876543210'}`;
  };

  // --- REPORT HANDLERS & PRINT RENDERS ---
  const handleAllDeliveryReport = () => {
    setReportMeta({ retailerName: null });
    setReportView('delivery');
  };

  const handleIndividualDeliveryReport = (retailerName) => {
    setReportMeta({ retailerName });
    setReportView('delivery');
  };

  const openCollectionModal = (retailerName) => {
    setCollectionModal({
      isOpen: true,
      retailerName,
      fromDate: selectedDate,
      toDate: selectedDate
    });
  };

  const handleGenerateCollectionReport = async () => {
    const fromStr = collectionModal.fromDate.toISOString().split('T')[0];
    const toStr = collectionModal.toDate.toISOString().split('T')[0];
    try {
      const res = await axios.get(`/api/orders?startDate=${fromStr}&endDate=${toStr}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      let filteredOrders = res.data;
      if (collectionModal.retailerName) {
        filteredOrders = filteredOrders.filter(o => o.retailerName === collectionModal.retailerName);
      }
      
      setCollectionModal(prev => ({ ...prev, isOpen: false }));
      setReportData(filteredOrders);
      setReportMeta({
        fromDate: fromStr,
        toDate: toStr,
        retailerName: collectionModal.retailerName
      });
      setReportView('collection');
    } catch (err) {
      alert('Failed to fetch collection orders');
    }
  };

  const handleAllPurchaseReport = () => {
    // Distributor aggregates all active orders of the day
    const activeOrders = orders.filter(o => {
      return o.products.some(p => {
        const q = activeShift === 'Morning' ? p.morningQty : activeShift === 'Evening' ? p.eveningQty : (p.morningQty + p.eveningQty);
        return q > 0;
      });
    });
    
    if (activeOrders.length === 0) {
      alert('No active orders to generate Purchase Report.');
      return;
    }
    
    setReportMeta({ retailerName: null });
    setReportData(activeOrders);
    setReportView('purchase');
  };

  const handleIndividualPurchaseReport = (retailerName) => {
    const retailerOrders = orders.filter(o => o.retailerName === retailerName);
    const activeOrders = retailerOrders.filter(o => {
      return o.products.some(p => {
        const q = activeShift === 'Morning' ? p.morningQty : activeShift === 'Evening' ? p.eveningQty : (p.morningQty + p.eveningQty);
        return q > 0;
      });
    });
    
    if (activeOrders.length === 0) {
      alert(`No active orders for ${retailerName} to generate invoice.`);
      return;
    }
    
    setReportMeta({ retailerName });
    setReportData(activeOrders);
    setReportView('purchase');
  };

  const renderDeliveryReport = () => {
    let activeOrders = orders;
    
    if (reportMeta && reportMeta.retailerName) {
      activeOrders = activeOrders.filter(o => o.retailerName === reportMeta.retailerName);
    }
    
    activeOrders = activeOrders.filter(o => {
      return o.products.some(p => {
        const qty = activeShift === 'Morning' ? p.morningQty : activeShift === 'Evening' ? p.eveningQty : (p.morningQty + p.eveningQty);
        return qty > 0;
      });
    });

    const activeProducts = [];
    activeOrders.forEach(o => {
      o.products.forEach(p => {
        const qty = activeShift === 'Morning' ? p.morningQty : activeShift === 'Evening' ? p.eveningQty : (p.morningQty + p.eveningQty);
        if (qty > 0 && !activeProducts.includes(p.name)) {
          activeProducts.push(p.name);
        }
      });
    });

    // Sort products based on standard order
    activeProducts.sort((a, b) => {
      const idxA = PRODUCT_SORT_ORDER.indexOf(a);
      const idxB = PRODUCT_SORT_ORDER.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    const getCrates = (order, prodName) => {
      const p = order.products.find(prod => prod.name === prodName);
      if (!p) return 0;
      return activeShift === 'Morning' ? p.morningQty : activeShift === 'Evening' ? p.eveningQty : (p.morningQty + p.eveningQty);
    };

    const getGujName = (name) => GUJARATI_PRODUCT_NAMES[name] || name;
    const shiftGuj = activeShift === 'Morning' ? 'સવાર' : activeShift === 'Evening' ? 'સાંજ' : 'સવાર અને સાંજ';

    const getDeliveryHeaderWrap = (name) => {
      if (DELIVERY_HEADER_WRAPS[name]) {
        return DELIVERY_HEADER_WRAPS[name];
      }
      let gujName = getGujName(name);
      gujName = gujName.replace(/([૦-૯]+x)([૦-૯]+)/g, '$1 $2');
      gujName = gujName.replace(/-ક/g, ' -ક');
      gujName = gujName.replace(/-બ/g, ' -બ');
      return gujName.split(' ');
    };

    const formatGujNameHeader = (name) => {
      const parts = getDeliveryHeaderWrap(name);
      return parts.map((part, idx) => (
        <div key={idx} style={{ fontSize: '10px', lineHeight: '1.2' }}>{part}</div>
      ));
    };

    const currentDateStr = selectedDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    return (
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '10px', color: '#000', backgroundColor: '#fff', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          border: '1px solid #ccc', 
          padding: '15px 20px', 
          marginBottom: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ flex: 1, textAlign: 'center', paddingLeft: '140px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
              યશ મિલ્ક માર્કેટિંગ-રાજકોટ-૧૦૦૭૪૫૯M
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginTop: '6px', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
              ડિલિવરી રિપોર્ટ
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: '#000', lineHeight: '1.4', fontFamily: "'Public Sans', 'Inter', sans-serif", whiteSpace: 'nowrap' }}>
            <div>તારીખ અને સમય: {toGujaratiDigits(currentDateStr)} - {shiftGuj}</div>
            <div style={{ marginTop: '2px' }}>{toGujaratiDigits(currentTimeStr)}</div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', color: '#000', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'left' }}>નામ</th>
              {activeProducts.map(pName => (
                <th key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', verticalAlign: 'bottom' }}>
                  {formatGujNameHeader(pName)}
                </th>
              ))}
              <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>કુલ</th>
            </tr>
          </thead>
          <tbody>
            {activeOrders.map(order => {
              const comp = companies.find(c => c.firmName === order.retailerName);
              const displayName = comp?.firmNameGujarati || order.retailerName;

              let rowTotal = 0;
              return (
                <tr key={order._id}>
                  <td style={{ border: '1px solid #000', padding: '8px', fontWeight: 'bold' }}>{displayName}</td>
                  {activeProducts.map(pName => {
                    const c = getCrates(order, pName);
                    rowTotal += c;
                    return (
                      <td key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                        {c ? toGujaratiDigits(c) : ''}
                      </td>
                    );
                  })}
                  <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                    {rowTotal ? toGujaratiDigits(rowTotal) : ''}
                  </td>
                </tr>
              );
            })}

            <tr style={{ fontWeight: 'bold', backgroundColor: '#fcfcfc' }}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>ટોટલ બેગ્સ</td>
              {activeProducts.map(pName => {
                const mult = BAG_MULTIPLIERS[pName] || 24;
                const totalCrates = activeOrders.reduce((sum, o) => sum + getCrates(o, pName), 0);
                return (
                  <td key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                    {totalCrates * mult ? toGujaratiDigits(totalCrates * mult) : ''}
                  </td>
                );
              })}
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                {toGujaratiDigits(activeOrders.reduce((grandSum, o) => {
                  return grandSum + activeProducts.reduce((sum, pName) => sum + (getCrates(o, pName) * (BAG_MULTIPLIERS[pName] || 24)), 0);
                }, 0))}
              </td>
            </tr>

            <tr style={{ fontWeight: 'bold', backgroundColor: '#fcfcfc' }}>
              <td style={{ border: '1px solid #000', padding: '8px' }}>ટોટલ કેટ્સ</td>
              {activeProducts.map(pName => {
                const totalCrates = activeOrders.reduce((sum, o) => sum + getCrates(o, pName), 0);
                return (
                  <td key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                    {totalCrates ? toGujaratiDigits(totalCrates) : ''}
                  </td>
                );
              })}
              <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>
                {toGujaratiDigits(activeOrders.reduce((grandSum, o) => {
                  return grandSum + activeProducts.reduce((sum, pName) => sum + getCrates(o, pName), 0);
                }, 0))}
              </td>
            </tr>
          </tbody>
        </table>
        
        <div style={{ marginTop: '30px', fontWeight: 'bold', fontSize: '13px' }}>
          યશ મિલ્ક માર્કેટિંગ-રાજકોટ-૧૦૦૭૪૫૯M
        </div>
      </div>
    );
  };

  const getProductHeaderRate = (pName) => {
    const normalized = pName.replace(/\s+/g, '').toLowerCase();
    for (const key of Object.keys(PRODUCT_INFO_FOR_HEADER)) {
      if (key.replace(/\s+/g, '').toLowerCase() === normalized) {
        const info = PRODUCT_INFO_FOR_HEADER[key];
        return `${info.rateStr} (${info.mrpStr})`;
      }
    }
    return '';
  };

  const renderCollectionReport = () => {
    if (!reportData) return null;

    const activeProducts = [];
    reportData.forEach(o => {
      o.products.forEach(p => {
        const qty = (p.morningQty || 0) + (p.eveningQty || 0);
        if (qty > 0 && !activeProducts.includes(p.name)) {
          activeProducts.push(p.name);
        }
      });
    });

    // Sort products based on standard order
    activeProducts.sort((a, b) => {
      const idxA = PRODUCT_SORT_ORDER.indexOf(a);
      const idxB = PRODUCT_SORT_ORDER.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    const getGujName = (name) => GUJARATI_PRODUCT_NAMES[name] || name;

    const rows = [];
    reportData.forEach(order => {
      const comp = companies.find(c => c.firmName === order.retailerName);
      const displayName = comp?.firmNameGujarati || order.retailerName;

      const hasMorning = order.products.some(p => p.morningQty > 0);
      if (hasMorning) {
        const morningAmt = order.products.reduce((sum, p) => {
          const rateFinal = (p.baseRate || p.rate || 0) + (p.morningRate || 0);
          return sum + (p.morningQty * rateFinal);
        }, 0);
        const morningCrates = order.products.reduce((sum, p) => sum + (p.morningQty || 0), 0);
        rows.push({
          name: displayName,
          shift: 'M',
          amount: Math.round(morningAmt),
          crates: morningCrates,
          quantities: order.products.reduce((map, p) => {
            map[p.name] = p.morningQty || 0;
            return map;
          }, {})
        });
      }

      const hasEvening = order.products.some(p => p.eveningQty > 0);
      if (hasEvening) {
        const eveningAmt = order.products.reduce((sum, p) => {
          const rateFinal = (p.baseRate || p.rate || 0) + (p.eveningRate || 0);
          return sum + (p.eveningQty * rateFinal);
        }, 0);
        const eveningCrates = order.products.reduce((sum, p) => sum + (p.eveningQty || 0), 0);
        rows.push({
          name: displayName,
          shift: 'E',
          amount: Math.round(eveningAmt),
          crates: eveningCrates,
          quantities: order.products.reduce((map, p) => {
            map[p.name] = p.eveningQty || 0;
            return map;
          }, {})
        });
      }
    });

    const morningTotalAmt = rows.filter(r => r.shift === 'M').reduce((sum, r) => sum + r.amount, 0);
    const morningTotalCrates = rows.filter(r => r.shift === 'M').reduce((sum, r) => sum + r.crates, 0);
    const eveningTotalAmt = rows.filter(r => r.shift === 'E').reduce((sum, r) => sum + r.amount, 0);
    const eveningTotalCrates = rows.filter(r => r.shift === 'E').reduce((sum, r) => sum + r.crates, 0);

    const getColTotalQty = (pName, shift) => {
      return rows.filter(r => r.shift === shift).reduce((sum, r) => sum + (r.quantities[pName] || 0), 0);
    };

    const currentTimeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

    return (
      <div style={{ margin: '0 auto', padding: '10px', color: '#000', backgroundColor: '#fff', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          border: '1px solid #ccc', 
          padding: '15px 20px', 
          marginBottom: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{ flex: 1, textAlign: 'center', paddingLeft: '140px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
              Yash Milk Marketing-Rajkot-1007459M
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginTop: '6px', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
              Collection Report
            </div>
          </div>
          <div style={{ textAlign: 'right', fontSize: '14px', fontWeight: 'bold', color: '#000', lineHeight: '1.4', fontFamily: "'Public Sans', 'Inter', sans-serif", whiteSpace: 'nowrap' }}>
            <div>{reportMeta.fromDate.split('-').reverse().join('-')} - MORNING</div>
            <div>Date & Time: {reportMeta.toDate.split('-').reverse().join('-')} - EVENING</div>
            <div style={{ marginTop: '2px' }}>{currentTimeStr}</div>
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', color: '#000', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'left' }}>Name</th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Shift</th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>Amount</th>
              <th style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>Total Crate</th>
              {activeProducts.map(pName => {
                const headerRate = getProductHeaderRate(pName);
                return (
                  <th key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'normal' }}>
                    <div style={{ fontWeight: 'bold' }}>{getGujName(pName)}</div>
                    {headerRate && <div style={{ fontSize: '9px', color: '#555', marginTop: '2px' }}>{toGujaratiDigits(headerRate)}</div>}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #000', padding: '6px' }}>{row.name}</td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center', fontWeight: 'bold' }}>{row.shift}</td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }}>{row.amount}</td>
                <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{row.crates}</td>
                {activeProducts.map(pName => (
                  <td key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                    {row.quantities[pName] || ''}
                  </td>
                ))}
              </tr>
            ))}

            <tr style={{ fontWeight: 'bold', backgroundColor: '#fcfcfc' }}>
              <td style={{ border: '1px solid #000', padding: '6px' }}>Total</td>
              <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>M</td>
              <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'right' }} rowSpan="2">
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 'bold' }}>
                  {morningTotalAmt + eveningTotalAmt}
                </div>
              </td>
              <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{morningTotalCrates}</td>
              {activeProducts.map(pName => (
                <td key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                  {getColTotalQty(pName, 'M') || ''}
                </td>
              ))}
            </tr>

            <tr style={{ fontWeight: 'bold', backgroundColor: '#fcfcfc' }}>
              <td style={{ border: '1px solid #000', padding: '6px' }}>Total</td>
              <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>E</td>
              <td style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>{eveningTotalCrates}</td>
              {activeProducts.map(pName => (
                <td key={pName} style={{ border: '1px solid #000', padding: '6px', textAlign: 'center' }}>
                  {getColTotalQty(pName, 'E') || ''}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  const getInvoiceData = () => {
    if (!reportData) return null;
    const isDistributor = !reportMeta.retailerName;
    
    let receiver = DISTRIBUTOR_INFO;
    let supplier = SUPPLIER_INFO;
    let invoiceNo = `R-${selectedDate.toISOString().split('T')[0].replace(/-/g, '')}-YASH`;
    
    if (!isDistributor) {
      supplier = DISTRIBUTOR_INFO;
      const comp = companies.find(c => c.firmName === reportMeta.retailerName);
      receiver = {
        companyCode: comp?.companyCode || 'C0100',
        firmName: comp?.firmName || reportMeta.retailerName,
        firmNameGujarati: comp?.firmNameGujarati || '',
        mobile: comp?.mobile1 || '9016624262',
        address: comp?.address || 'Bharti Nagar, Rajkot, Gujarat, India',
        gst: comp?.gst || '24AWEPB9363P1Z4',
        pan: comp?.panCard || 'AWEPB9363P',
        fssai: comp?.foodLicense || '10714030000100',
        placeOfSupply: '24 - Gujarat'
      };
      invoiceNo = `R-${selectedDate.toISOString().split('T')[0].replace(/-/g, '')}-${receiver.companyCode}`;
    }
    
    const productItems = [];
    const activeProducts = [];
    const ordersList = isDistributor ? orders : orders.filter(o => o.retailerName === reportMeta.retailerName);
    
    ordersList.forEach(o => {
      o.products.forEach(p => {
        const qty = activeShift === 'Morning' ? p.morningQty : activeShift === 'Evening' ? p.eveningQty : (p.morningQty + p.eveningQty);
        if (qty > 0 && !activeProducts.includes(p.name)) {
          activeProducts.push(p.name);
        }
      });
    });
    
    // Sort products based on standard order
    activeProducts.sort((a, b) => {
      const idxA = PRODUCT_SORT_ORDER.indexOf(a);
      const idxB = PRODUCT_SORT_ORDER.indexOf(b);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    });

    const getInvoiceProductDetails = (name, isDistributor) => {
      const match = Object.keys(INVOICE_PRODUCT_DETAILS).find(k => k.replace(/\s+/g, '').toLowerCase() === name.replace(/\s+/g, '').toLowerCase());
      if (match) {
        const details = INVOICE_PRODUCT_DETAILS[match];
        return {
          hsn: details.hsn,
          mrp: details.mrp,
          basicRate: isDistributor ? details.distributorRate : details.retailerRate
        };
      }
      
      // Fallback mapping
      const lower = name.toLowerCase();
      let hsn = '040120';
      if (lower.includes('gold')) {
        hsn = '040140';
      } else if (lower.includes('dahi') || lower.includes('bm') || lower.includes('butter') || lower.includes('masti')) {
        hsn = '040390';
      } else if (lower.includes('paneer')) {
        hsn = '040690';
      }
      
      const mrp = PRODUCT_INFO_FOR_HEADER[name] ? parseInt(PRODUCT_INFO_FOR_HEADER[name].mrpStr) : 30;
      const rateVal = PRODUCT_INFO_FOR_HEADER[name] ? parseFloat(PRODUCT_INFO_FOR_HEADER[name].rateStr) : 600.00;
      
      const gstRate = (hsn === '040390' || hsn === '040690') ? 5.00 : 0.00;
      const sellingBasicRate = rateVal / (1 + gstRate / 100);
      const basicRate = isDistributor ? (sellingBasicRate * 0.98) : sellingBasicRate;
      
      return {
        hsn,
        mrp,
        basicRate: parseFloat(basicRate.toFixed(2))
      };
    };

    activeProducts.forEach(pName => {
      const totalCrates = ordersList.reduce((sum, o) => {
        const p = o.products.find(prod => prod.name === pName);
        if (!p) return sum;
        const q = activeShift === 'Morning' ? p.morningQty : activeShift === 'Evening' ? p.eveningQty : (p.morningQty + p.eveningQty);
        return sum + q;
      }, 0);
      
      if (totalCrates > 0) {
        const mult = BAG_MULTIPLIERS[pName] || 24;
        const totalPieces = totalCrates * mult;
        
        const details = getInvoiceProductDetails(pName, isDistributor);
        const basicRate = details.basicRate;
        const hsn = details.hsn;
        const mrp = details.mrp;
        
        const pricePerPiece = parseFloat((basicRate / mult).toFixed(2));
        const taxableAmount = parseFloat((totalCrates * basicRate).toFixed(2));
        const gstRate = (hsn === '040390' || hsn === '040690') ? 5.00 : 0.00;
        const gstAmount = parseFloat((taxableAmount * (gstRate / 100)).toFixed(2));
        const netAmount = parseFloat((taxableAmount + gstAmount).toFixed(2));
        
        productItems.push({
          name: pName,
          hsn,
          mrp,
          unitCrate: mult,
          basicRate,
          pricePerPiece,
          pieces: totalPieces,
          crates: totalCrates,
          taxableAmount,
          gstRate,
          gstAmount,
          netAmount
        });
      }
    });
    
    const subtotal = productItems.reduce((sum, item) => sum + item.taxableAmount, 0);
    const totalGst = productItems.reduce((sum, item) => sum + item.gstAmount, 0);
    const totalNetAmount = subtotal + totalGst;
    
    const grandTotal = Math.round(totalNetAmount);
    const roundOffVal = grandTotal - totalNetAmount;
    
    // Group by HSN
    const hsnGroups = {};
    productItems.forEach(item => {
      if (!hsnGroups[item.hsn]) {
        hsnGroups[item.hsn] = {
          hsn: item.hsn,
          quantity: 0,
          taxableAmount: 0,
          gstRate: item.gstRate,
          gstAmount: 0
        };
      }
      hsnGroups[item.hsn].quantity += item.crates;
      hsnGroups[item.hsn].taxableAmount += item.taxableAmount;
      hsnGroups[item.hsn].gstAmount += item.gstAmount;
    });
    
    return {
      supplier,
      receiver,
      invoiceNo,
      shift: activeShift === 'All' ? 'Evening' : activeShift,
      items: productItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalGst: parseFloat(totalGst.toFixed(2)),
      roundOff: parseFloat(roundOffVal.toFixed(2)),
      grandTotal,
      hsnGroups: Object.values(hsnGroups).map(g => ({
        ...g,
        quantity: parseFloat(g.quantity.toFixed(2)),
        taxableAmount: parseFloat(g.taxableAmount.toFixed(2)),
        gstAmount: parseFloat(g.gstAmount.toFixed(2))
      }))
    };
  };

  const renderPurchaseReport = () => {
    const data = getInvoiceData();
    if (!data) return null;

    const invoiceDateStr = selectedDate.toLocaleDateString('en-GB').replace(/\//g, '-');
    const invoiceTitle = data.totalGst > 0 ? "Tax Invoice" : "Retail Invoice";
    const totalNetVal = data.items.reduce((sum, item) => sum + item.netAmount, 0).toFixed(2);

    return (
      <div style={{ 
        maxWidth: '1000px', 
        margin: '0 auto', 
        padding: '20px', 
        color: '#000', 
        backgroundColor: '#fff', 
        fontFamily: "'Public Sans', 'Inter', sans-serif",
        border: '1px solid #000',
        fontSize: '11px',
        lineHeight: '1.3'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', borderBottom: '1px solid #000', paddingBottom: '10px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 'bold' }}>{data.supplier.name}</h2>
            <div>{data.supplier.address}</div>
          </div>
          <div style={{ borderLeft: '1px solid #000', paddingLeft: '10px' }}>
            <div>FSSAI No:- {data.supplier.fssai}</div>
            <div>Place of Supply:- {data.supplier.placeOfSupply}</div>
            <div>GSTIN No:- {data.supplier.gst}</div>
            <div>PAN No:- {data.supplier.pan}</div>
          </div>
          <div style={{ borderLeft: '1px solid #000', paddingLeft: '10px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase' }}>{invoiceTitle}</h3>
            <div>Date:- {invoiceDateStr}</div>
            <div>Time:- 12:13:39 PM</div>
            <div>Shift:- {data.shift}</div>
            <div style={{ fontWeight: 'bold', marginTop: '4px' }}>Original/Duplicate</div>
            <div style={{ fontWeight: 'bold' }}>Cash/Debit Memo</div>
            <div>Invoice Number: {data.invoiceNo}</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid #000', minHeight: '100px' }}>
          <div style={{ padding: '8px 10px 8px 0' }}>
            <h4 style={{ margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '2px' }}>Details of Receiver(Billed to)</h4>
            <div style={{ fontWeight: 'bold' }}>{data.receiver.firmName}</div>
            {data.receiver.firmNameGujarati && <div>({data.receiver.firmNameGujarati})</div>}
            <div>{data.receiver.address}</div>
            <div>FSSAI No.:- {data.receiver.fssai}</div>
            <div>Place of Supply: {data.receiver.placeOfSupply}</div>
            <div>GSTIN No.:- {data.receiver.gst}</div>
            <div>PAN No.:- {data.receiver.pan}</div>
            {data.receiver.mobile && <div>Mo. {data.receiver.mobile}</div>}
          </div>
          <div style={{ borderLeft: '1px solid #000', padding: '8px 0 8px 10px' }}>
            <h4 style={{ margin: '0 0 6px 0', fontWeight: 'bold', borderBottom: '1px solid #ddd', paddingBottom: '2px' }}>Details of Consignee(Shipped to)</h4>
            <div style={{ fontWeight: 'bold' }}>{data.receiver.firmName}</div>
            {data.receiver.firmNameGujarati && <div>({data.receiver.firmNameGujarati})</div>}
            <div>{data.receiver.address}</div>
            <div>FSSAI No.:- {data.receiver.fssai}</div>
            <div>Place of Supply: {data.receiver.placeOfSupply}</div>
            <div>GSTIN No.:- {data.receiver.gst}</div>
            <div>PAN No.:- {data.receiver.pan}</div>
            {data.receiver.mobile && <div>Mo. {data.receiver.mobile}</div>}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0 0 0', borderBottom: '1px solid #000' }}>
          <thead>
            <tr style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">Sr. No.</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">Product Name</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">HSN/SAC Code</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">MRP</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">Unit Crate</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">Basic Rate</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">Price Per Piece</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} colSpan="2">Quantity</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">Taxable Amount</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} colSpan="2">GST</th>
              <th style={{ border: '1px solid #000', padding: '4px' }} rowSpan="2">Net Amount</th>
            </tr>
            <tr style={{ textAlign: 'center', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>
              <th style={{ border: '1px solid #000', padding: '4px' }}>Piecs</th>
              <th style={{ border: '1px solid #000', padding: '4px' }}>Box</th>
              <th style={{ border: '1px solid #000', padding: '4px' }}>Rate%</th>
              <th style={{ border: '1px solid #000', padding: '4px' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, idx) => (
              <tr key={idx}>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{idx + 1}</td>
                <td style={{ border: '1px solid #000', padding: '4px', fontWeight: 'bold' }}>{getFullCommercialName(item.name)}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.hsn}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.mrp}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.unitCrate}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{item.basicRate.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{item.pricePerPiece.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.pieces}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.crates.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{item.taxableAmount.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>{item.gstRate.toFixed(2)}%</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{item.gstAmount.toFixed(2)}</td>
                <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>{item.netAmount.toFixed(2)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 'bold', backgroundColor: '#fcfcfc' }}>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'left' }} colSpan="7">Note:-</td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>
                {data.items.reduce((sum, item) => sum + item.pieces, 0)}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}>
                {data.items.reduce((sum, item) => sum + item.crates, 0).toFixed(2)}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>
                {data.subtotal.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'center' }}></td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>
                {data.totalGst.toFixed(2)}
              </td>
              <td style={{ border: '1px solid #000', padding: '4px', textAlign: 'right' }}>
                {totalNetVal}
              </td>
            </tr>
          </tbody>
        </table>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', margin: '15px 0' }}>
          <div>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline', marginBottom: '4px' }}>Bank Details:</div>
            <div>Bank:- {BANK_DETAILS.bankName}</div>
            <div>Branch:- {BANK_DETAILS.branch}</div>
            <div>A/C No:- {BANK_DETAILS.accountNumber}</div>
            <div>ISFC:- {BANK_DETAILS.ifsc}</div>
            <div>UPI:- {BANK_DETAILS.upi}</div>
          </div>
          <div style={{ borderLeft: '1px solid #000', borderRight: '1px solid #000', padding: '0 10px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '9px' }}>
              <thead>
                <tr style={{ fontWeight: 'bold', borderBottom: '1.5px solid #000', textAlign: 'center' }}>
                  <th style={{ border: '1px solid #000', padding: '2px' }}>HSN/SAC Code</th>
                  <th style={{ border: '1px solid #000', padding: '2px' }}>Quantity</th>
                  <th style={{ border: '1px solid #000', padding: '2px' }}>Taxable Amount</th>
                  <th style={{ border: '1px solid #000', padding: '2px' }} colSpan="2">Central Tax</th>
                  <th style={{ border: '1px solid #000', padding: '2px' }} colSpan="2">State/UT Tax</th>
                  <th style={{ border: '1px solid #000', padding: '2px' }} colSpan="2">Integrated Tax</th>
                  <th style={{ border: '1px solid #000', padding: '2px' }}>Total Tax Amount</th>
                </tr>
                <tr style={{ fontSize: '7px', textAlign: 'center' }}>
                  <th style={{ border: '1px solid #000' }}></th>
                  <th style={{ border: '1px solid #000' }}></th>
                  <th style={{ border: '1px solid #000' }}></th>
                  <th style={{ border: '1px solid #000' }}>Rate%</th>
                  <th style={{ border: '1px solid #000' }}>Amount</th>
                  <th style={{ border: '1px solid #000' }}>Rate%</th>
                  <th style={{ border: '1px solid #000' }}>Amount</th>
                  <th style={{ border: '1px solid #000' }}>Rate%</th>
                  <th style={{ border: '1px solid #000' }}>Amount</th>
                  <th style={{ border: '1px solid #000' }}></th>
                </tr>
              </thead>
              <tbody>
                {data.hsnGroups.map((g, idx) => {
                  const rateHalf = (g.gstRate / 2).toFixed(2) + '%';
                  const amtHalf = (g.gstAmount / 2).toFixed(2);
                  return (
                    <tr key={idx} style={{ textAlign: 'center' }}>
                      <td style={{ border: '1px solid #000', padding: '2px' }}>{g.hsn}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'center' }}>{g.quantity}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{g.taxableAmount.toFixed(2)}</td>
                      <td style={{ border: '1px solid #000', padding: '2px' }}>{rateHalf}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{amtHalf}</td>
                      <td style={{ border: '1px solid #000', padding: '2px' }}>{rateHalf}</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{amtHalf}</td>
                      <td style={{ border: '1px solid #000', padding: '2px' }}>0.00%</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>0.00</td>
                      <td style={{ border: '1px solid #000', padding: '2px', textAlign: 'right' }}>{g.gstAmount.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ paddingLeft: '10px', textAlign: 'right', fontFamily: "'Public Sans', 'Inter', sans-serif" }}>
            <div>Nil Rated Amnt: {data.items.filter(item => item.gstRate === 0).reduce((sum, item) => sum + item.taxableAmount, 0).toFixed(2)}</div>
            <div>Taxable Amnt: {data.items.filter(item => item.gstRate > 0).reduce((sum, item) => sum + item.taxableAmount, 0).toFixed(2)}</div>
            <div>Central Tax: {(data.totalGst / 2).toFixed(2)}</div>
            <div>State/UT Tax: {(data.totalGst / 2).toFixed(2)}</div>
            <div>Round Off: {data.roundOff >= 0 ? `+${data.roundOff.toFixed(2)}` : data.roundOff.toFixed(2)}</div>
            <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: '6px' }}>Grand Total: {data.grandTotal}</div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #000', borderBottom: '1px solid #000', padding: '6px 0', fontWeight: 'bold' }}>
          Bill Amount:- {numberToWords(data.grandTotal)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr', marginTop: '20px', minHeight: '80px' }}>
          <div style={{ fontSize: '8px', paddingRight: '10px' }}>
            <div style={{ fontWeight: 'bold', textDecoration: 'underline' }}>Terms & Condition:-</div>
            <div>1. Our risk and responsibility ceases as soon as the goods leave our premises.</div>
            <div>2. Cheque return charge Rs.250.</div>
            <div>3. Interest @18% p.a. will be charged if payment is not made within due date.</div>
            <div>4. Goods once sold will not be taken back.</div>
            <div>5. We give no undertaking whatever to accept a return of goods for exchange.</div>
            <div>6. Please check the stock at the time of taking delivery.</div>
            <div>7. Goods with tempered packing will not be taken back.</div>
            <div>8. Not a part payment only one time full payment accepted.</div>
            <div>9. Payment term 100% advance.</div>
            <div>10. Subject to rajkot jurisdiction only. E. & O. E.</div>
          </div>
          <div style={{ borderLeft: '1px solid #000', borderRight: '1px solid #000', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
            <div style={{ borderBottom: '1px solid #000', width: '80px', marginTop: '40px' }}></div>
            <div style={{ fontWeight: 'bold' }}>Customer Signature</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
            <div style={{ fontWeight: 'bold' }}>For, {data.supplier.name}</div>
            <div style={{ fontWeight: 'bold', marginTop: '30px' }}>(Authorised Signatory)</div>
          </div>
        </div>
      </div>
    );
  };
  // --- END OF REPORT GENERATORS ---


  // Render Edit View
  if (editingOrder) {
    const getMrp = (prodName) => {
      const normalized = prodName.replace(/\s+/g, '').toLowerCase();
      for (const key of Object.keys(PRODUCT_INFO_FOR_HEADER)) {
        if (normalized.includes(key.replace(/\s+/g, '').toLowerCase())) {
          return PRODUCT_INFO_FOR_HEADER[key].mrpStr;
        }
      }
      if (prodName.includes('29')) return '29';
      if (prodName.includes('35')) return '35';
      if (prodName.includes('36')) return '36';
      return '';
    };

    const displayProducts = editingOrder.products.filter(p => {
      if (editProductSearch && !p.name.toLowerCase().includes(editProductSearch.toLowerCase())) {
        return false;
      }
      if (!showAllProducts) {
        const hasQty = (p.morningQty || 0) > 0 || (p.eveningQty || 0) > 0;
        return p.selected || hasQty;
      }
      return true;
    });

    const activeProductsCount = editingOrder.products.filter(p => (p.morningQty || 0) > 0 || (p.eveningQty || 0) > 0).length;
    const activeMorningCount = editingOrder.products.filter(p => (p.morningQty || 0) > 0).length;
    const activeEveningCount = editingOrder.products.filter(p => (p.eveningQty || 0) > 0).length;

    return (
      <Container>
        <Title theme={theme}>Edit Order</Title>
        <Breadcrumb theme={theme}>
          <BreadLink theme={theme} onClick={() => setEditingOrder(null)}>Dashboard</BreadLink>
          <span>•</span>
          <BreadLink theme={theme} onClick={() => setEditingOrder(null)}>Orders</BreadLink>
          <span>•</span>
          <span style={{ color: theme.muted }}>{editingOrder.retailerName}</span>
        </Breadcrumb>

        <EditControlsCard theme={theme}>
          <SelectDateWrapper theme={theme}>
            <FloatingLabel theme={theme}>Select Date</FloatingLabel>
            <DatePicker 
              selected={selectedDate} 
              onChange={(date) => { setSelectedDate(date); setEditingOrder(prev => ({ ...prev, date: date.toISOString().split('T')[0] })); }}
              dateFormat="dd-MM-yyyy"
            />
            <Calendar size={16} style={{ color: theme.muted }} />
          </SelectDateWrapper>

          <SwitchContainer>
            <SwitchTrack active={showAllProducts} theme={theme} onClick={() => setShowAllProducts(prev => !prev)}>
              <SwitchThumb active={showAllProducts} />
            </SwitchTrack>
            <span style={{ fontSize: 14, fontWeight: 700, color: theme.text }}>All</span>
          </SwitchContainer>

          <ActionButton 
            theme={theme} 
            onClick={() => handleEditClick(editingOrder.retailerName)}
            style={{ 
              border: `1.5px solid ${theme.border}`, 
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: theme.card
            }}
            title="Reset default products"
          >
            <RotateCw size={14} />
          </ActionButton>

          <EditSearchWrapper>
            <EditSearchIconWrapper theme={theme}>
              <Search size={16} />
            </EditSearchIconWrapper>
            <EditSearchInput 
              type="text" 
              placeholder="Search products..." 
              value={editProductSearch}
              onChange={(e) => setEditProductSearch(e.target.value)}
              theme={theme}
            />
          </EditSearchWrapper>

          <CrateOrderBtn theme={theme} onClick={() => alert("Crate Order calculation completed!")}>
            Crate Order
          </CrateOrderBtn>
        </EditControlsCard>

        <ProductGrid>
          {displayProducts.map((p, index) => {
            const morningRateFinal = (p.baseRate || p.rate || 0) + (p.morningRate || 0);
            const eveningRateFinal = (p.baseRate || p.rate || 0) + (p.eveningRate || 0);
            
            // Need original index in the main products array for state updates
            const originalIndex = editingOrder.products.findIndex(prod => prod.name === p.name);

            return (
              <ProductCard key={index} theme={theme}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                  {getProductIllustration(p.name, 64)}
                  <div style={{ flex: 1 }}>
                    <ProductName theme={theme} style={{ margin: 0, fontSize: 15 }}>{p.name}</ProductName>
                    <PrevRef theme={theme} style={{ margin: '4px 0 0 0' }}>{getPrevDayRef(editingOrder.retailerName, p.name)}</PrevRef>
                  </div>
                </div>

                <ProductCardColumns>
                  <ShiftCol>
                    <ShiftRateHeader theme={theme}>
                      <Sun size={13} fill="#FFB020" stroke="#FFB020" />
                      <RateValue theme={theme}>
                        {Number(morningRateFinal.toFixed(4))} {getMrp(p.name) ? `(${getMrp(p.name)})` : ''}
                      </RateValue>
                    </ShiftRateHeader>
                    <ShiftInputWrapper theme={theme}>
                      <ShiftInputLabel theme={theme}>Morning</ShiftInputLabel>
                      <ShiftInput 
                        type="number"
                        step="any"
                        value={p.morningQty === 0 ? '0' : p.morningQty}
                        onChange={(e) => handleQtyChange(originalIndex, 'morningQty', e.target.value)}
                        theme={theme}
                      />
                    </ShiftInputWrapper>
                  </ShiftCol>

                  <ShiftCol>
                    <ShiftRateHeader theme={theme}>
                      <Moon size={13} fill="#2065D1" stroke="#2065D1" />
                      <RateValue theme={theme}>
                        {Number(eveningRateFinal.toFixed(4))} {getMrp(p.name) ? `(${getMrp(p.name)})` : ''}
                      </RateValue>
                    </ShiftRateHeader>
                    <ShiftInputWrapper theme={theme}>
                      <ShiftInputLabel theme={theme}>Evening</ShiftInputLabel>
                      <ShiftInput 
                        type="number"
                        step="any"
                        value={p.eveningQty === 0 ? '0' : p.eveningQty}
                        onChange={(e) => handleQtyChange(originalIndex, 'eveningQty', e.target.value)}
                        theme={theme}
                      />
                    </ShiftInputWrapper>
                  </ShiftCol>
                </ProductCardColumns>
              </ProductCard>
            );
          })}
        </ProductGrid>

        <SummaryCard theme={theme}>
          <BadgeRow>
            <OutlineBadge colorVal="#00AB55" bgColor="rgba(0, 171, 85, 0.06)" theme={theme}>
              {activeProductsCount} Products
            </OutlineBadge>
            <OutlineBadge colorVal="#2065D1" bgColor="rgba(32, 101, 209, 0.06)" theme={theme}>
              {activeMorningCount} Morning
            </OutlineBadge>
            <OutlineBadge colorVal="#2065D1" bgColor="rgba(32, 101, 209, 0.06)" theme={theme}>
              {activeEveningCount} Evening
            </OutlineBadge>
          </BadgeRow>

          <CenteredHeader theme={theme}>PO Details</CenteredHeader>

          <POInputsRow>
            <POInputFieldWrapper>
              <Sun size={18} fill="#FFB020" stroke="#FFB020" style={{ opacity: 0.8 }} />
              <POInputContainer>
                <POLabel theme={theme}>Morning PO Number</POLabel>
                <POInput 
                  type="text"
                  value={editingOrder.morningPONumber || ''}
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, morningPONumber: e.target.value }))}
                  theme={theme}
                />
              </POInputContainer>
            </POInputFieldWrapper>

            <POInputFieldWrapper>
              <Moon size={18} fill="#2065D1" stroke="#2065D1" style={{ opacity: 0.8 }} />
              <POInputContainer>
                <POLabel theme={theme}>Evening PO Number</POLabel>
                <POInput 
                  type="text"
                  value={editingOrder.eveningPONumber || ''}
                  onChange={(e) => setEditingOrder(prev => ({ ...prev, eveningPONumber: e.target.value }))}
                  theme={theme}
                />
              </POInputContainer>
            </POInputFieldWrapper>
          </POInputsRow>
        </SummaryCard>

        <SummaryCard theme={theme} style={{ marginTop: 24 }}>
          <SummaryTitle theme={theme}>Order Summary</SummaryTitle>
          <CleanTable>
            <thead>
              <tr>
                <CleanTh theme={theme}>Shift</CleanTh>
                <CleanTh theme={theme} align="right">Crate</CleanTh>
                <CleanTh theme={theme} align="right">Amount</CleanTh>
              </tr>
            </thead>
            <tbody>
              <tr>
                <CleanTd theme={theme}>
                  <Sun size={14} fill="#FFB020" stroke="#FFB020" style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  <span style={{ verticalAlign: 'middle' }}>Morning</span>
                </CleanTd>
                <CleanTd theme={theme} align="right">{shiftTotals.morningCrates}</CleanTd>
                <CleanTd theme={theme} align="right">{shiftTotals.morningAmt.toFixed(2)}</CleanTd>
              </tr>
              <tr>
                <CleanTd theme={theme}>
                  <Moon size={14} fill="#2065D1" stroke="#2065D1" style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  <span style={{ verticalAlign: 'middle' }}>Evening</span>
                </CleanTd>
                <CleanTd theme={theme} align="right">{shiftTotals.eveningCrates}</CleanTd>
                <CleanTd theme={theme} align="right">{shiftTotals.eveningAmt.toFixed(2)}</CleanTd>
              </tr>
              <tr>
                <CleanTd theme={theme} bold isLast>Total</CleanTd>
                <CleanTd theme={theme} bold align="right" isLast>{shiftTotals.totalCrates}</CleanTd>
                <CleanTd theme={theme} bold align="right" isLast>{Math.round(shiftTotals.totalAmt)}</CleanTd>
              </tr>
            </tbody>
          </CleanTable>
        </SummaryCard>

        <BottomBar theme={theme}>
          <GreenSaveBtn theme={theme} onClick={handleSaveOrder}>
            <Save size={18} />
            Save Order
          </GreenSaveBtn>
        </BottomBar>
      </Container>
    );
  }

  // Render List View
  if (reportView) {
    return (
      <PrintContainer className="print-area">
        <PrintStyle />
        <div className="no-print" style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
          <PrintBtn onClick={() => window.print()}>Print Report</PrintBtn>
          <CloseReportBtn onClick={() => { setReportView(null); setReportData(null); }}>Close</CloseReportBtn>
        </div>
        {reportView === 'delivery' && renderDeliveryReport()}
        {reportView === 'collection' && renderCollectionReport()}
        {reportView === 'purchase' && renderPurchaseReport()}
      </PrintContainer>
    );
  }

  return (
    <Container>
      <Title theme={theme}>{t('Orders')}</Title>
      <Breadcrumb theme={theme}>
        <BreadLink theme={theme} onClick={() => setActiveTab('dashboard')}>Dashboard</BreadLink>
        <span>•</span>
        <span>Orders</span>
      </Breadcrumb>

      <EditControlsCard theme={theme} style={{ padding: '16px 20px', gap: '16px', alignItems: 'center' }}>
        <SelectDateWrapper theme={theme}>
          <FloatingLabel theme={theme}>Select Date</FloatingLabel>
          <DatePicker 
            selected={selectedDate} 
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
          />
          <Calendar size={16} style={{ color: theme.muted }} />
        </SelectDateWrapper>

        <SelectShiftWrapper theme={theme}>
          <FloatingLabel theme={theme}>Shift</FloatingLabel>
          <select 
            value={activeShift} 
            onChange={(e) => setActiveShift(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
          </select>
        </SelectShiftWrapper>

        <SolidSummaryBtn theme={theme} onClick={handleAllDeliveryReport}>
          Total Summary
        </SolidSummaryBtn>

        <InlineBadgeRow>
          <OutlineBadge 
            colorVal="#00AB55" 
            bgColor={activeShift === 'All' ? 'rgba(0, 171, 85, 0.15)' : 'rgba(0, 171, 85, 0.05)'} 
            theme={theme} 
            style={{ padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}
            onClick={() => setActiveShift('All')}
          >
            {listStats.total} Orders
          </OutlineBadge>
          <OutlineBadge 
            colorVal="#2065D1" 
            bgColor={activeShift === 'Morning' ? 'rgba(32, 101, 209, 0.15)' : 'rgba(32, 101, 209, 0.05)'} 
            theme={theme} 
            style={{ padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}
            onClick={() => setActiveShift('Morning')}
          >
            {listStats.morning} Morning
          </OutlineBadge>
          <OutlineBadge 
            colorVal="#2065D1" 
            bgColor={activeShift === 'Evening' ? 'rgba(32, 101, 209, 0.15)' : 'rgba(32, 101, 209, 0.05)'} 
            theme={theme} 
            style={{ padding: '6px 12px', fontSize: 13, cursor: 'pointer' }}
            onClick={() => setActiveShift('Evening')}
          >
            {listStats.evening} Evening
          </OutlineBadge>
        </InlineBadgeRow>
      </EditControlsCard>

      <RetailerListPanel theme={theme}>
        {/* DISTRIBUTOR LEVEL SUMMARY CARD */}
        <RetailerRow 
          theme={theme} 
          style={{ 
            borderLeft: `5px solid ${theme.primary}`, 
            backgroundColor: theme.isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            cursor: 'default'
          }}
        >
          <span style={{ fontWeight: 700, color: theme.primary, fontSize: 15 }}>
            Yash Milk Marketing-Rajkot-1007459M
          </span>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ActionButton 
              theme={theme} 
              colorVal="#00AB55"
              title="Delivery Report (All)"
              onClick={(e) => { e.stopPropagation(); handleAllDeliveryReport(); }}
            >
              <Truck size={18} />
            </ActionButton>
            <ActionButton 
              theme={theme} 
              colorVal="#00AB55"
              title="Collection Report (All)"
              onClick={(e) => { e.stopPropagation(); openCollectionModal(null); }}
            >
              <RupeeIcon size={18} />
            </ActionButton>
            <ActionButton 
              theme={theme} 
              colorVal="#00AB55"
              title="Purchase Report (All)"
              onClick={(e) => { e.stopPropagation(); handleAllPurchaseReport(); }}
            >
              <FileText size={18} />
            </ActionButton>
            <ActionButton 
              theme={theme} 
              colorVal="#00AB55"
              title="Call Distributor"
              onClick={(e) => { e.stopPropagation(); window.location.href = 'tel:9016624262'; }}
            >
              <Phone size={18} />
            </ActionButton>
          </div>
        </RetailerRow>

        {/* INDIVIDUAL RETAILER CARDS */}
        {(() => {
          const activeCompanies = retailers.filter(ret => {
            const comp = companies.find(c => c.firmName === ret.companyName);
            const isCompActive = comp ? comp.status === 'Active' : true;
            if (!isCompActive) return false;

            if (activeShift === 'Morning') {
              const order = orders.find(o => o.retailerName === ret.companyName);
              return order ? order.products.some(p => p.morningQty > 0) : false;
            }
            if (activeShift === 'Evening') {
              const order = orders.find(o => o.retailerName === ret.companyName);
              return order ? order.products.some(p => p.eveningQty > 0) : false;
            }
            return true;
          });

          return activeCompanies.map((ret, idx) => {
            const order = orders.find(o => o.retailerName === ret.companyName);
            const hasM = order ? order.products.some(p => p.morningQty > 0) : false;
            const hasE = order ? order.products.some(p => p.eveningQty > 0) : false;

            return (
              <RetailerRow 
                key={ret._id} 
                theme={theme} 
                onClick={() => handleEditClick(ret.companyName)}
                isLast={idx === activeCompanies.length - 1}
              >
                <span style={{ fontWeight: 700, fontSize: 15, color: theme.text }}>
                  {ret.companyName}
                </span>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CircleIndicator active={hasM}>M</CircleIndicator>
                  <CircleIndicator active={hasE}>E</CircleIndicator>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }} onClick={(e) => e.stopPropagation()}>
                    <ActionButton 
                      theme={theme} 
                      colorVal="#00AB55"
                      title="Delivery Report"
                      onClick={(e) => { e.stopPropagation(); handleIndividualDeliveryReport(ret.companyName); }}
                    >
                      <Truck size={18} />
                    </ActionButton>

                    <ActionButton 
                      theme={theme} 
                      colorVal="#00AB55"
                      title="Collection Report"
                      onClick={(e) => { e.stopPropagation(); openCollectionModal(ret.companyName); }}
                    >
                      <RupeeIcon size={18} />
                    </ActionButton>

                    <ActionButton 
                      theme={theme} 
                      colorVal="#00AB55"
                      title="Purchase Report"
                      onClick={(e) => { e.stopPropagation(); handleIndividualPurchaseReport(ret.companyName); }}
                    >
                      <FileText size={18} />
                    </ActionButton>

                    <ActionButton 
                      theme={theme} 
                      colorVal="#00AB55"
                      title="Call"
                      onClick={(e) => { e.stopPropagation(); handleCall(ret); }}
                    >
                      <Phone size={18} />
                    </ActionButton>
                  </div>
                </div>
              </RetailerRow>
            );
          });
        })()}
      </RetailerListPanel>

      {/* DATE RANGE MODAL FOR COLLECTION REPORT */}
      {collectionModal.isOpen && (
        <ModalOverlay>
          <ModalContent theme={theme} style={{ width: '400px' }}>
            <ModalHeader>
              <ModalTitle>Select Date Range for Collection Report</ModalTitle>
              <CloseBtn theme={theme} onClick={() => setCollectionModal(prev => ({ ...prev, isOpen: false }))}>
                <X size={20} />
              </CloseBtn>
            </ModalHeader>
            <div style={{ padding: '8px 0' }}>
              <FormGroup style={{ marginBottom: '16px' }}>
                <Label theme={theme}>From Date</Label>
                <DatePickerWrapper theme={theme} style={{ width: '100%', boxSizing: 'border-box' }}>
                  <Calendar size={18} />
                  <DatePicker 
                    selected={collectionModal.fromDate} 
                    onChange={(date) => setCollectionModal(prev => ({ ...prev, fromDate: date }))}
                    dateFormat="yyyy-MM-dd"
                  />
                </DatePickerWrapper>
              </FormGroup>
              <FormGroup style={{ marginBottom: '24px' }}>
                <Label theme={theme}>To Date</Label>
                <DatePickerWrapper theme={theme} style={{ width: '100%', boxSizing: 'border-box' }}>
                  <Calendar size={18} />
                  <DatePicker 
                    selected={collectionModal.toDate} 
                    onChange={(date) => setCollectionModal(prev => ({ ...prev, toDate: date }))}
                    dateFormat="yyyy-MM-dd"
                  />
                </DatePickerWrapper>
              </FormGroup>
            </div>
            <ButtonRow style={{ marginTop: '12px' }}>
              <CancelBtn type="button" theme={theme} onClick={() => setCollectionModal(prev => ({ ...prev, isOpen: false }))}>
                Cancel
              </CancelBtn>
              <PrimaryBtn type="button" theme={theme} onClick={handleGenerateCollectionReport}>
                Generate Report
              </PrimaryBtn>
            </ButtonRow>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

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

export default Orders;
