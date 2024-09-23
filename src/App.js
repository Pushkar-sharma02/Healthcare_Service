import React, { useState, useEffect } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import './HealthcareServicesApp.css';

const HealthcareServicesApp = () => {
  const [services, setServices] = useState(() => {
    const storedServices = localStorage.getItem('healthcareServices');
    return storedServices ? JSON.parse(storedServices) : [];
  });
  const [newService, setNewService] = useState({ name: '', description: '', price: '' });
  const [editingService, setEditingService] = useState(null);
  const [error, setError] = useState('');

  // Store services in localStorage whenever they are updated
  useEffect(() => {
    localStorage.setItem('healthcareServices', JSON.stringify(services));
    console.log('Services saved:', services);
  }, [services]);

  const handleInputChange = (e, isEditing = false) => {
    const { name, value } = e.target;
    if (isEditing) {
      setEditingService({ ...editingService, [name]: value });
    } else {
      setNewService({ ...newService, [name]: value });
    }
  };

  const validateService = (service) => {
    if (!service.name || !service.description || !service.price) {
      setError('All fields are required.');
      return false;
    }
    if (isNaN(parseFloat(service.price))) {
      setError('Price must be a valid number.');
      return false;
    }
    setError('');
    return true;
  };

  const addService = (e) => {
    e.preventDefault();
    if (validateService(newService)) {
      setServices(prevServices => [...prevServices, { ...newService, id: Date.now() }]);
      setNewService({ name: '', description: '', price: '' });
    }
  };

  const startEditing = (service) => {
    setEditingService(service);
  };

  const updateService = (e) => {
    e.preventDefault();
    if (validateService(editingService)) {
      setServices(prevServices => 
        prevServices.map(s => (s.id === editingService.id ? editingService : s))
      );
      setEditingService(null);
    }
  };

  const deleteService = (id) => {
    setServices(prevServices => prevServices.filter(s => s.id !== id));
  };

  return (
    <div className="healthcare-app">
      <h1 className="app-title">Healthcare Services Management</h1>

      {error && (
        <div className="error-alert">
          {error}
        </div>
      )}

      <div className="service-form">
        <h2>{editingService ? 'Update Service' : 'Add New Service'}</h2>
        <form onSubmit={editingService ? updateService : addService} className="form-inputs">
          <input
            type="text"
            name="name"
            value={editingService ? editingService.name : newService.name}
            onChange={(e) => handleInputChange(e, !!editingService)}
            placeholder="Service Name"
            className="input"
          />
          <input
            type="text"
            name="description"
            value={editingService ? editingService.description : newService.description}
            onChange={(e) => handleInputChange(e, !!editingService)}
            placeholder="Description"
            className="input"
          />
          <input
            type="text"
            name="price"
            value={editingService ? editingService.price : newService.price}
            onChange={(e) => handleInputChange(e, !!editingService)}
            placeholder="Price"
            className="input"
          />
          <button type="submit" className="primary-button">
            {editingService ? 'Update Service' : 'Add Service'}
          </button>
          {editingService && (
            <button
              type="button"
              onClick={() => setEditingService(null)}
              className="secondary-button cancel-button"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <h2 className="services-title">Services List</h2>
      <div className="services-list">
        {services.length > 0 ? (
          services.map(service => (
            <div key={service.id} className="service-item">
              <div className="service-details">
                <h3 className="service-name">{service.name}</h3>
                <p className="service-description">{service.description}</p>
                <p className="service-price">Price: ${service.price}</p>
              </div>
              <div className="service-actions">
                <button
                  onClick={() => startEditing(service)}
                  className="edit-button"
                >
                  <Edit2 className="button-icon" /> Edit
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  className="delete-button"
                >
                  <Trash2 className="button-icon" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No services available. Add a new service to get started.</p>
        )}
      </div>
    </div>
  );
};

export default HealthcareServicesApp;