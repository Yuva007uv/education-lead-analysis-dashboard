import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter } from 'recharts';
import Papa from 'papaparse';
import _ from 'lodash';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('city');

  useEffect(() => {
    const loadData = async () => {
      try {
        const csvData = await window.fs.readFile('leads_basic_details.csv', { encoding: 'utf8' });
        const parsed = Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          dynamicTyping: true
        });
        
        // Clean the data and handle outliers
        const cleanedData = parsed.data.filter(row => 
          row.age && row.age > 10 && row.age < 100 // Filter out obvious age errors
        );
        
        setData(cleanedData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  // Data processing functions
  const getCityData = () => {
    const cityGroups = _.groupBy(data, 'current_city');
    return Object.entries(cityGroups).map(([city, leads]) => ({
      name: city,
      count: leads.length,
      percentage: ((leads.length / data.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);
  };

  const getEducationData = () => {
    const eduGroups = _.groupBy(data, 'current_education');
    return Object.entries(eduGroups).map(([education, leads]) => ({
      name: education,
      count: leads.length
    })).sort((a, b) => b.count - a.count);
  };

  const getLeadSourceData = () => {
    const sourceGroups = _.groupBy(data, 'lead_gen_source');
    return Object.entries(sourceGroups).map(([source, leads]) => ({
      name: source.replace(/_/g, ' ').toUpperCase(),
      count: leads.length,
      percentage: ((leads.length / data.length) * 100).toFixed(1)
    })).sort((a, b) => b.count - a.count);
  };

  const getGenderData = () => {
    const genderGroups = _.groupBy(data, 'gender');
    return Object.entries(genderGroups).map(([gender, leads]) => ({
      name: gender,
      count: leads.length,
      percentage: ((leads.length / data.length) * 100).toFixed(1)
    }));
  };

  const getAgeDistribution = () => {
    const ageGroups = {
      '16-18': 0,
      '19-21': 0,
      '22-24': 0,
      '25+': 0
    };
    
    data.forEach(lead => {
      if (lead.age >= 16 && lead.age <= 18) ageGroups['16-18']++;
      else if (lead.age >= 19 && lead.age <= 21) ageGroups['19-21']++;
      else if (lead.age >= 22 && lead.age <= 24) ageGroups['22-24']++;
      else if (lead.age >= 25) ageGroups['25+']++;
    });

    return Object.entries(ageGroups).map(([range, count]) => ({
      name: range,
      count: count
    }));
  };

  const getParentOccupationData = () => {
    const occupationGroups = _.groupBy(data, 'parent_occupation');
    return Object.entries(occupationGroups).map(([occupation, leads]) => ({
      name: occupation,
      count: leads.length
    })).sort((a, b) => b.count - a.count);
  };

  // Chart colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

  const cityData = getCityData();
  const educationData = getEducationData();
  const leadSourceData = getLeadSourceData();
  const genderData = getGenderData();
  const ageData = getAgeDistribution();
  const occupationData = getParentOccupationData();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Leads Analytics Dashboard</h1>
        <p className="text-gray-600">Total Leads: {data.length}</p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
          <p className="text-3xl font-bold text-blue-600">{data.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Cities Covered</h3>
          <p className="text-3xl font-bold text-green-600">{cityData.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Lead Sources</h3>
          <p className="text-3xl font-bold text-purple-600">{leadSourceData.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Avg Age</h3>
          <p className="text-3xl font-bold text-orange-600">
            {Math.round(_.meanBy(data, 'age'))}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* City Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Leads by City</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Lead Generation Sources</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={leadSourceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({name, percentage}) => `${name}: ${percentage}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {leadSourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Education Level */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Education Levels</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={educationData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Gender Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={genderData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="count"
              >
                {genderData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Age Distribution */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Age Groups</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FFBB28" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Parent Occupation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Parent Occupations</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={occupationData.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Table */}
      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Quick Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Top Cities</h4>
              {cityData.slice(0, 3).map((city, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">{city.name}</span>
                  <span className="text-sm font-medium">{city.count} ({city.percentage}%)</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Top Lead Sources</h4>
              {leadSourceData.slice(0, 3).map((source, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">{source.name}</span>
                  <span className="text-sm font-medium">{source.count} ({source.percentage}%)</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Top Parent Occupations</h4>
              {occupationData.slice(0, 3).map((occupation, idx) => (
                <div key={idx} className="flex justify-between py-1">
                  <span className="text-sm text-gray-600">{occupation.name}</span>
                  <span className="text-sm font-medium">{occupation.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;