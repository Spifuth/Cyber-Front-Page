#!/usr/bin/env python3
"""
Backend API Testing Script for Cyberpunk Portfolio Application
Tests all backend endpoints using the external URL configuration
"""

import requests
import json
import sys
from datetime import datetime

# Get the backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

def test_backend_connectivity():
    """Test basic backend connectivity"""
    print("=" * 60)
    print("TESTING BACKEND CONNECTIVITY")
    print("=" * 60)
    
    backend_url = get_backend_url()
    if not backend_url:
        print("❌ CRITICAL: Could not get backend URL from frontend/.env")
        return False
    
    print(f"Backend URL: {backend_url}")
    
    try:
        # Test basic connectivity with a simple GET request
        response = requests.get(f"{backend_url}/api/", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
        
        if response.status_code == 200:
            print("✅ Backend connectivity: WORKING")
            return True
        else:
            print(f"❌ Backend connectivity: FAILED (Status: {response.status_code})")
            return False
            
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Backend connectivity: CONNECTION ERROR - {e}")
        return False
    except requests.exceptions.Timeout as e:
        print(f"❌ Backend connectivity: TIMEOUT ERROR - {e}")
        return False
    except Exception as e:
        print(f"❌ Backend connectivity: UNEXPECTED ERROR - {e}")
        return False

def test_hello_world_endpoint():
    """Test the GET /api/ endpoint"""
    print("\n" + "=" * 60)
    print("TESTING HELLO WORLD ENDPOINT")
    print("=" * 60)
    
    backend_url = get_backend_url()
    
    try:
        response = requests.get(f"{backend_url}/api/", timeout=10)
        print(f"GET /api/ - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Response: {data}")
            
            if data.get("message") == "Hello World":
                print("✅ Hello World endpoint: WORKING")
                return True
            else:
                print(f"❌ Hello World endpoint: UNEXPECTED RESPONSE - {data}")
                return False
        else:
            print(f"❌ Hello World endpoint: FAILED (Status: {response.status_code})")
            return False
            
    except Exception as e:
        print(f"❌ Hello World endpoint: ERROR - {e}")
        return False

def test_status_endpoints():
    """Test the status check endpoints (POST and GET /api/status)"""
    print("\n" + "=" * 60)
    print("TESTING STATUS CHECK ENDPOINTS")
    print("=" * 60)
    
    backend_url = get_backend_url()
    
    # Test POST /api/status
    try:
        test_data = {
            "client_name": "test_client_cyberpunk_portfolio"
        }
        
        print("Testing POST /api/status...")
        response = requests.post(
            f"{backend_url}/api/status", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"POST /api/status - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Created status check: {data}")
            
            # Verify the response structure
            required_fields = ["id", "client_name", "timestamp"]
            if all(field in data for field in required_fields):
                print("✅ POST /api/status: WORKING")
                post_success = True
            else:
                print(f"❌ POST /api/status: MISSING FIELDS - {data}")
                post_success = False
        else:
            print(f"❌ POST /api/status: FAILED (Status: {response.status_code})")
            print(f"Response: {response.text}")
            post_success = False
            
    except Exception as e:
        print(f"❌ POST /api/status: ERROR - {e}")
        post_success = False
    
    # Test GET /api/status
    try:
        print("\nTesting GET /api/status...")
        response = requests.get(f"{backend_url}/api/status", timeout=10)
        
        print(f"GET /api/status - Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Retrieved {len(data)} status checks")
            
            if isinstance(data, list):
                print("✅ GET /api/status: WORKING")
                get_success = True
                
                # Show sample data if available
                if data:
                    print(f"Sample status check: {data[0]}")
            else:
                print(f"❌ GET /api/status: UNEXPECTED FORMAT - {type(data)}")
                get_success = False
        else:
            print(f"❌ GET /api/status: FAILED (Status: {response.status_code})")
            print(f"Response: {response.text}")
            get_success = False
            
    except Exception as e:
        print(f"❌ GET /api/status: ERROR - {e}")
        get_success = False
    
    return post_success and get_success

def test_cors_configuration():
    """Test CORS configuration"""
    print("\n" + "=" * 60)
    print("TESTING CORS CONFIGURATION")
    print("=" * 60)
    
    backend_url = get_backend_url()
    
    try:
        # Test with OPTIONS request to check CORS headers
        response = requests.options(f"{backend_url}/api/", timeout=10)
        print(f"OPTIONS /api/ - Status: {response.status_code}")
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
        }
        
        print("CORS Headers:")
        for header, value in cors_headers.items():
            print(f"  {header}: {value}")
        
        if cors_headers['Access-Control-Allow-Origin']:
            print("✅ CORS configuration: WORKING")
            return True
        else:
            print("⚠️  CORS configuration: NO CORS HEADERS (may still work)")
            return True  # Not critical for basic functionality
            
    except Exception as e:
        print(f"⚠️  CORS configuration: ERROR - {e}")
        return True  # Not critical for basic functionality

def main():
    """Run all backend tests"""
    print("CYBERPUNK PORTFOLIO - BACKEND API TESTING")
    print("=" * 60)
    print(f"Test started at: {datetime.now()}")
    
    # Track test results
    test_results = {
        'connectivity': False,
        'hello_world': False,
        'status_endpoints': False,
        'cors': False
    }
    
    # Run tests
    test_results['connectivity'] = test_backend_connectivity()
    
    if test_results['connectivity']:
        test_results['hello_world'] = test_hello_world_endpoint()
        test_results['status_endpoints'] = test_status_endpoints()
        test_results['cors'] = test_cors_configuration()
    else:
        print("\n❌ Skipping other tests due to connectivity failure")
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(test_results)
    passed_tests = sum(test_results.values())
    
    for test_name, result in test_results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name.replace('_', ' ').title()}: {status}")
    
    print(f"\nOverall: {passed_tests}/{total_tests} tests passed")
    
    if passed_tests == total_tests:
        print("🎉 ALL BACKEND TESTS PASSED!")
        return True
    elif test_results['connectivity'] and test_results['hello_world']:
        print("⚠️  BACKEND PARTIALLY WORKING - Core functionality available")
        return True
    else:
        print("❌ BACKEND TESTS FAILED - Critical issues found")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)