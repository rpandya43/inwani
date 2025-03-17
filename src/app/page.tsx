'use client';

import { useState } from 'react';
import axios from 'axios';
import { MapPinIcon } from '@heroicons/react/24/outline';

interface Feature {
  geometry: {
    x: number;
    y: number;
  };
}

interface ApiResponse {
  features: Feature[];
}

export default function Home() {
  const [formData, setFormData] = useState({
    zone: '',
    building: '',
    street: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.get<ApiResponse>(
        `https://services.gisqatar.org.qa/server/rest/services/Vector/QARS_wgs84/MapServer/0/query?where=zone_no=${formData.zone}+and+street_no=${formData.street}+and+building_no=${formData.building}&f=json`
      );

      const features = response.data.features;

      if (!features || features.length === 0) {
        setError('Invalid address entered.');
        return;
      }

      const { x, y } = features[0].geometry;
      window.open(`https://www.google.com/maps/search/?api=1&query=${y},${x}`, '_blank');
    } catch (err) {
      setError('An error occurred while fetching the coordinates.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Qatar Location Finder</h1>
          <p className="text-gray-400">Enter your address details to find the location on Google Maps</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="zone" className="block text-sm font-medium text-gray-300 mb-2">
              Zone Number
            </label>
            <input
              type="text"
              id="zone"
              name="zone"
              value={formData.zone}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter zone number"
              required
            />
          </div>

          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-300 mb-2">
              Building Number
            </label>
            <input
              type="text"
              id="building"
              name="building"
              value={formData.building}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter building number"
              required
            />
          </div>

          <div>
            <label htmlFor="street" className="block text-sm font-medium text-gray-300 mb-2">
              Street Number
            </label>
            <input
              type="text"
              id="street"
              name="street"
              value={formData.street}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter street number"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            {loading ? (
              'Loading...'
            ) : (
              <>
                <MapPinIcon className="w-5 h-5" />
                Find Location
              </>
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
