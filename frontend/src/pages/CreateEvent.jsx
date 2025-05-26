import React from 'react';
import EventForm from '../components/EventForm';

const CreateEvent = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <EventForm mode="create" />
    </div>
  );
};

export default CreateEvent; 