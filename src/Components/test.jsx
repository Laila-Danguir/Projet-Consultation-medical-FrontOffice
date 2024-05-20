import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Select, Upload, TimePicker, message, Input } from 'antd'; // Import Input from 'antd'
import { UploadOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import moment from 'moment';

const Registre = () => {
  const token = localStorage.getItem('token');
  const [form] = Form.useForm();
  const [formm, setFormm] = useState({
    _id: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    sexe: "",
    speciality: "",
    imageUrl: "",
    fromTime: "",
    toTime: "",
    phone: "",
    description: "", // Add description field to form state
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/doctors/');
        const data = response.data;
        setFormm(data);
        form.setFieldsValue({
          ...data,
          fromTime: data.fromTime ? moment(data.fromTime, 'HH:mm') : null,
          toTime: data.toTime ? moment(data.toTime, 'HH:mm') : null
        });
      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    fetchDoctorData();
  }, [form, token]);

  const handleInsert = async (values) => {
    try {
      const fromTime = values.fromTime ? values.fromTime.format('HH:mm') : '';
      const toTime = values.toTime ? values.toTime.format('HH:mm') : '';
      const payload = { ...values, fromTime, toTime };

      await axios.post('http://localhost:3000/doctors', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      message.success('Doctor information saved successfully.');
    } catch (error) {
      console.error('Error saving doctor information:', error);
      message.error('Failed to save doctor information.');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    form.setFieldsValue({
      ...formm,
      fromTime: formm.fromTime ? moment(formm.fromTime, 'HH:mm') : null,
      toTime: formm.toTime ? moment(formm.toTime, 'HH:mm') : null,
    });
  };

  const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const uploadProps = {
    name: 'file',
    action: 'https://api.cloudinary.com/v1_1/doagzivng/image/upload',
    data: {
      upload_preset: 'kj1jodbh',
    },
    listType: 'picture',
    onChange(info) {
      if (info.file.status === 'uploading') {
        console.log('Uploading...');
      }
      if (info.file.status === 'done') {
        console.log('File uploaded:', info.file.response);
        setFormm({ ...formm, imageUrl: info.file.response.secure_url });
      } else if (info.file.status === 'error') {
        console.error('Upload error:', info.file.error, info.file.response);
        message.error('Failed to upload image.');
      }
    }
  };

  return (
    <div className="p-5 border-2 shadow-lg border-grey-300 rounded">
      <h2 className="text-2xl font-bold mb-3">Welcome To Your Profile:</h2>
      <Form
        form={form}
        {...formItemLayout}
        className="justify-text"
        initialValues={{
          ...formm,
          fromTime: formm.fromTime ? moment(formm.fromTime, 'HH:mm') : null,
          toTime: formm.toTime ? moment(formm.toTime, 'HH:mm') : null
        }}
        onFinish={handleInsert}
      >
        {formm.imageUrl && (
          <div className="flex justify-center">
            <img
              src={formm.imageUrl}
              alt="Profile Image"
              className="rounded-full w-[150px] h-[150px] mb-5"
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <Form.Item label="First Name" name="firstname">
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastname">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="Sex" name="sexe">
            <Select>
              <Select.Option value="homme">Homme</Select.Option>
              <Select.Option value="femme">Femme</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="City" name={['address', 'city']}>
            <Input />
          </Form.Item>
          <Form.Item label="State" name={['address', 'state']}>
            <Input />
          </Form.Item>
          <Form.Item label="Country" name={['address', 'country']}>
            <Input />
          </Form.Item>
          <Form.Item label="Speciality" name="speciality">
            <Input />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input.TextArea rows={5} />
          </Form.Item>
          <Form.Item label="Experience" name="experience">
            <Input />
          </Form.Item>
          <Form.Item label="Fee Per" name="feePer">
            <Input />
          </Form.Item>
          <Form.Item label="From Time" name="fromTime">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item label="To Time" name="toTime">
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item label="Image" name="imageUrl">
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>

        </div>
        <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
          <Button type="primary" htmlType="submit" icon={<FontAwesomeIcon icon={faSave} />}>
            Save
          </Button>
          <Button type="default" htmlType="button" className="ml-2" onClick={handleCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Registre;
