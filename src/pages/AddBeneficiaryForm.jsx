import React from 'react';
import BeneficiaryForm from './BeneficiaryForm';

const AddBeneficiaryForm = ({ onClose, onSuccess }) => {
  return (
    <BeneficiaryForm
      beneficiary={null} // لا نمرر أي بيانات
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default AddBeneficiaryForm;
