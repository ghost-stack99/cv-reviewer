import React, { useState } from 'react';
import axios from 'axios';
import { Button, CircularProgress, Input, TextField } from '@mui/material';

const Form = () => {
  const [formData, setFormData] = useState({ name: '', job: '', resume: null });
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (event) => {
    setFormData({ ...formData, resume: event.target.files[0] });
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('job', formData.job);
    formDataToSend.append('resume', formData.resume);

    try {
      const response = await axios.post(
        'http://ec2-15-206-172-208.ap-south-1.compute.amazonaws.com:3410/upload',
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setDownloadUrl(response.data.url);
    } catch (error) {
      console.error('Error uploading file: ', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    window.open('http://ec2-15-206-172-208.ap-south-1.compute.amazonaws.com:3410/reports/'+downloadUrl);
  };

  return (
<div className=" flex justify-center items-center h-screen" style={{ textAlign: 'center', padding: '20px' }}>
            <div className="container bg-slate-700  p-8 border-b-8 border-red-500 shadow-lg">
                <div className="space-y-4" style={{ textAlign: 'center', padding: '20px' }}>
        <TextField
          name="name"
          label="Name"
          className='bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500'
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <TextField 
          className='bg-green-50 border border-[#ee6d21] text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500'
          name="job"
          label="Job"
          value={formData.job}
          onChange={handleChange}
          fullWidth
          margin="normal"
          variant="outlined"
        />
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          id="resume-upload"
        />
        <div className='grid md:grid-cols-2 md:gap-6'>
        <label htmlFor="resume-upload">
          <Button variant="outlined" className='m-4' component="span">
            Upload Resume
          </Button>
          </label>

          <Button
            variant="outlined"
            onClick={handleSubmit}
            disabled={loading || !formData.name || !formData.job || !formData.resume}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit'}
          </Button>
        </div>
        {downloadUrl && (
          <div>
            <Button className='' onClick={handleDownload}>
              Download Report
            </Button>
        </div>
      )}
                </div>
            </div>
        </div>
  );
};

export default Form;
