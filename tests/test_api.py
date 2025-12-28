"""
Test to verify API can start and endpoints are accessible
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from simplitax.api import create_app

def test_api_creation():
    """Test that API can be created"""
    app = create_app({'TESTING': True})
    assert app is not None
    assert app.config['TESTING'] is True

def test_health_endpoint():
    """Test health check endpoint"""
    app = create_app({'TESTING': True})
    client = app.test_client()
    
    response = client.get('/health')
    assert response.status_code == 200
    
    data = response.get_json()
    assert data['status'] == 'healthy'
    assert 'version' in data

if __name__ == '__main__':
    print("Testing API creation...")
    test_api_creation()
    print("✓ API created successfully")
    
    print("Testing health endpoint...")
    test_health_endpoint()
    print("✓ Health endpoint working")
    
    print("\nAll API tests passed!")
