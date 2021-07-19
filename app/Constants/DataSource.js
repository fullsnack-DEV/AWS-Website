const DataSource = {
  Gender: [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ],
  FeeCycle: [
    { label: 'Weekly', value: 'weekly' },
    { label: 'Biweekly', value: 'biweekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ],
  CurrencyType: [
    { label: 'CAD', value: 'CAD' },
    { label: 'USD', value: 'USD' },
    { label: 'KRW', value: 'KRW' },
  ],
  NumberOfSet: [
    { label: '1', value: '1' },
    { label: '3', value: '3' },
    { label: '5', value: '5' },
    { label: '9', value: '9' },
  ],
  NumberOfGame: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
  ],
  TieBreaker: [
    { label: '6:6', value: '6' },
    { label: '7:7', value: '7' },
    { label: '8:8', value: '8' },
  ],
  EventCycle: [
    { label: 'Does not repeat', value: 'Does not repeat' },
    { label: 'Daily', value: 'Daily' },
    { label: 'Weekly', value: 'Weekly' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Yearly', value: 'Yearly' },
  ],
  filterByPayment: [
    'All invoices',
    'Open',
    'Paid',
  ],
  filterByBatch: [
    'Single Invoice',
    'Member',
    'Batch',
  ],

};

export default DataSource
