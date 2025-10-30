const referenceRepository = require('../repositories/referenceRepository');

class ReferenceController {
  // Get banners endpoint
  async getBanners(req, res) {
    try {
      const banners = await referenceRepository.getAllBanners();
      
      res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: banners
      });
      
    } catch (error) {
      console.error('Get banners error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
  
  // Get services endpoint
  async getServices(req, res) {
    try {
      const services = await referenceRepository.getAllServices();
      
      res.status(200).json({
        status: 0,
        message: 'Sukses',
        data: services
      });
      
    } catch (error) {
      console.error('Get services error:', error);
      res.status(500).json({
        status: 500,
        message: 'Internal server error'
      });
    }
  }
}

module.exports = new ReferenceController();
