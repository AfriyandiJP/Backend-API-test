const pool = require('../config/db');

class ReferenceRepository {
  // Get all banners
  async getAllBanners() {
    const query = `
      SELECT banner_name, banner_image, description
      FROM banners
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
  
  // Get all services
  async getAllServices() {
    const query = `
      SELECT service_code, service_name, service_icon, service_tariff, category
      FROM services
      ORDER BY category, service_tariff ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
  
  // Get service by code
  async getServiceByCode(serviceCode) {
    const query = `
      SELECT service_code, service_name, service_icon, service_tariff, category
      FROM services
      WHERE service_code = $1
    `;
    const result = await pool.query(query, [serviceCode]);
    return result.rows[0] || null;
  }
}

module.exports = new ReferenceRepository();
