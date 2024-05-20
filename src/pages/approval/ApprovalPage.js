import React from 'react';
import { useLocation } from 'react-router-dom';
import ApprovalList from './ApprovalList';
import ApprovalInsert from './ApprovalInsert';

const ApprovalPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const fg = params.get('fg');

  if(!fg){
    return <ApprovalInsert />;
  }

  return <ApprovalList />;
};

export default ApprovalPage;