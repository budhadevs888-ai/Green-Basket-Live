import requests
import sys
from datetime import datetime
import json
import os

class GreenBasketAPITester:
    def __init__(self, base_url="https://basket-admin-hub.preview.emergentagent.com"):
        self.base_url = base_url
        self.admin_token = None
        self.seller_token = None
        self.customer_token = None
        self.delivery_token = None
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        self.seller_id = None
        self.customer_id = None
        self.delivery_id = None
        self.product_ids = []
        self.order_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, token=None, description=""):
        """Run a single API test"""
        url = f"{self.base_url}/api/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        if token:
            headers['Authorization'] = f'Bearer {token}'

        self.tests_run += 1
        print(f"\n🔍 [{self.tests_run}] Testing {name}...")
        if description:
            print(f"   Description: {description}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PATCH':
                response = requests.patch(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"   ✅ PASSED - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"   ❌ FAILED - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text[:200]}...")
                
                self.failed_tests.append({
                    "name": name,
                    "endpoint": endpoint,
                    "expected": expected_status,
                    "actual": response.status_code,
                    "method": method
                })
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"   ❌ FAILED - Network Error: {str(e)}")
            self.failed_tests.append({
                "name": name,
                "endpoint": endpoint,
                "error": f"Network Error: {str(e)}",
                "method": method
            })
            return False, {}

    def test_health_check(self):
        """Test basic health endpoint"""
        return self.run_test("Health Check", "GET", "health", 200, description="Basic API health check")

    def test_admin_auth(self):
        """Test admin authentication"""
        # Send OTP
        success, _ = self.run_test(
            "Admin Send OTP", "POST", "auth/send-otp", 200,
            data={"phone": "9999999999"},
            description="Send OTP to pre-seeded admin"
        )
        if not success:
            return False

        # Verify OTP
        success, response = self.run_test(
            "Admin Verify OTP", "POST", "auth/verify-otp", 200,
            data={"phone": "9999999999", "otp": "123456", "role": "ADMIN"},
            description="Verify admin OTP and get token"
        )
        if success and 'token' in response:
            self.admin_token = response['token']
            print(f"   🔑 Admin token acquired")
            return True
        return False

    def test_seller_auth(self):
        """Test seller authentication and registration"""
        # Send OTP
        success, _ = self.run_test(
            "Seller Send OTP", "POST", "auth/send-otp", 200,
            data={"phone": "8888888888"},
            description="Send OTP for seller (already registered from previous tests)"
        )
        if not success:
            return False

        # Verify OTP (existing seller)
        success, response = self.run_test(
            "Seller Verify OTP", "POST", "auth/verify-otp", 200,
            data={"phone": "8888888888", "otp": "123456", "role": "SELLER"},
            description="Login existing seller and get token"
        )
        if success and 'token' in response:
            self.seller_token = response['token']
            self.seller_id = response['user']['id']
            print(f"   🔑 Seller token acquired, ID: {self.seller_id}")
            return True
        return False

    def test_customer_auth(self):
        """Test customer authentication and registration"""
        # Send OTP
        success, _ = self.run_test(
            "Customer Send OTP", "POST", "auth/send-otp", 200,
            data={"phone": "7777777777"},
            description="Send OTP for new customer registration"
        )
        if not success:
            return False

        # Verify OTP (creates new customer)
        success, response = self.run_test(
            "Customer Verify OTP", "POST", "auth/verify-otp", 200,
            data={"phone": "7777777777", "otp": "123456", "role": "CUSTOMER"},
            description="Register new customer and get token"
        )
        if success and 'token' in response:
            self.customer_token = response['token']
            self.customer_id = response['user']['id']
            print(f"   🔑 Customer token acquired, ID: {self.customer_id}")
            return True
        return False

    def test_delivery_auth(self):
        """Test delivery partner authentication and registration"""
        # Send OTP
        success, _ = self.run_test(
            "Delivery Send OTP", "POST", "auth/send-otp", 200,
            data={"phone": "6666666666"},
            description="Send OTP for delivery partner (already registered from previous tests)"
        )
        if not success:
            return False

        # Verify OTP (existing delivery partner)
        success, response = self.run_test(
            "Delivery Verify OTP", "POST", "auth/verify-otp", 200,
            data={"phone": "6666666666", "otp": "123456", "role": "DELIVERY"},
            description="Login existing delivery partner and get token"
        )
        if success and 'token' in response:
            self.delivery_token = response['token']
            self.delivery_id = response['user']['id']
            print(f"   🔑 Delivery token acquired, ID: {self.delivery_id}")
            return True
        return False

    def test_admin_dashboard(self):
        """Test admin dashboard"""
        return self.run_test(
            "Admin Dashboard", "GET", "admin/dashboard", 200, 
            token=self.admin_token,
            description="Get admin dashboard metrics"
        )

    def test_seller_products(self):
        """Test seller product management"""
        # Add bulk products
        success, response = self.run_test(
            "Seller Add Products", "POST", "seller/products/bulk", 200,
            data={
                "products": [
                    {"name": "Tomatoes", "unit": "kg", "price": 40.0},
                    {"name": "Onions", "unit": "kg", "price": 30.0}
                ]
            },
            token=self.seller_token,
            description="Add products to seller inventory"
        )
        if success and 'products' in response:
            self.product_ids = [p['id'] for p in response['products']]
            print(f"   📦 Added {len(self.product_ids)} products")
            return True
        return False

    def test_admin_approve_seller(self):
        """Test admin approving seller"""
        if not self.seller_id:
            return False
        return self.run_test(
            "Admin Approve Seller", "POST", f"admin/sellers/{self.seller_id}/approve", 200,
            token=self.admin_token,
            description="Admin approves the seller registration"
        )

    def test_admin_approve_products(self):
        """Test admin approving products"""
        success_count = 0
        for product_id in self.product_ids[:2]:  # Test first 2 products
            success, _ = self.run_test(
                f"Admin Approve Product", "POST", f"admin/products/{product_id}/approve", 200,
                token=self.admin_token,
                description=f"Admin approves product {product_id}"
            )
            if success:
                success_count += 1
        
        return success_count > 0

    def test_seller_stock_management(self):
        """Test seller daily stock confirmation"""
        if not self.product_ids:
            return False
        
        return self.run_test(
            "Seller Daily Stock", "POST", "seller/stock/daily-confirm", 200,
            data={
                "items": [
                    {"product_id": self.product_ids[0], "stock": 100},
                    {"product_id": self.product_ids[1], "stock": 50}
                ]
            },
            token=self.seller_token,
            description="Seller confirms daily stock levels"
        )

    def test_customer_location(self):
        """Test customer location setup"""
        return self.run_test(
            "Customer Set Location", "POST", "customer/location", 200,
            data={
                "latitude": 12.9716,
                "longitude": 77.5946,
                "address": "123 Test Street",
                "city": "Bangalore",
                "house": "A-101",
                "area": "Test Area",
                "pincode": "560001"
            },
            token=self.customer_token,
            description="Customer sets delivery location"
        )

    def test_customer_products(self):
        """Test customer viewing products"""
        return self.run_test(
            "Customer Get Products", "GET", "customer/products", 200,
            token=self.customer_token,
            description="Customer views available products"
        )

    def test_customer_checkout(self):
        """Test customer placing order"""
        if not self.product_ids:
            return False
            
        success, response = self.run_test(
            "Customer Checkout", "POST", "customer/cart/checkout", 200,
            data={
                "items": [
                    {"product_id": self.product_ids[0], "quantity": 2}
                ],
                "delivery_address": {
                    "address": "123 Test Street, A-101, Test Area, Bangalore - 560001",
                    "latitude": 12.9716,
                    "longitude": 77.5946
                }
            },
            token=self.customer_token,
            description="Customer places an order"
        )
        if success and 'order' in response:
            self.order_id = response['order']['id']
            print(f"   🛒 Order placed: {self.order_id}")
            return True
        return False

    def test_admin_approve_delivery(self):
        """Test admin approving delivery partner"""
        if not self.delivery_id:
            return False
        return self.run_test(
            "Admin Approve Delivery", "POST", f"admin/delivery-partners/{self.delivery_id}/approve", 200,
            token=self.admin_token,
            description="Admin approves the delivery partner registration"
        )

    def test_delivery_availability(self):
        """Test delivery partner setting availability"""
        return self.run_test(
            "Delivery Set Available", "POST", "delivery/availability", 200,
            data={"is_available": True},
            token=self.delivery_token,
            description="Delivery partner sets availability to true"
        )

    def test_new_seller_register_endpoint(self):
        """Test new seller registration endpoint with all fields"""
        return self.run_test(
            "Seller Register Endpoint", "POST", "seller/register", 200,
            data={
                "shop_name": "Test Green Grocery",
                "city": "Bangalore",
                "address": "123 MG Road, Bangalore",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "bank_account": "1234567890",
                "bank_ifsc": "SBIN0001234",
                "bank_name": "State Bank of India",
                "categories": ["Fruits", "Vegetables"]
            },
            token=self.seller_token,
            description="Test seller registration form submission with Google Maps data"
        )

    def test_new_delivery_register_endpoint(self):
        """Test new delivery partner registration endpoint"""
        return self.run_test(
            "Delivery Register Endpoint", "POST", "delivery/register", 200,
            data={
                "city": "Bangalore", 
                "address": "456 Brigade Road, Bangalore",
                "latitude": 12.9716,
                "longitude": 77.5946,
                "vehicle_type": "Two-Wheeler",
                "vehicle_number": "KA01AB1234"
            },
            token=self.delivery_token,
            description="Test delivery partner registration form with vehicle details"
        )

    def test_admin_products_endpoint(self):
        """Test new admin products management endpoints"""
        # Get all products
        success, response = self.run_test(
            "Admin Get Products", "GET", "admin/products", 200,
            token=self.admin_token,
            description="Get all products for admin approval"
        )
        if not success:
            return False

        # Get products by status
        success, _ = self.run_test(
            "Admin Get Pending Products", "GET", "admin/products?status=pending", 200,
            token=self.admin_token,
            description="Filter products by PENDING status"
        )

        return success

    def test_product_approval_workflow(self):
        """Test the complete product approval workflow"""
        # First add products as seller
        success, response = self.run_test(
            "Seller Add Products for Approval", "POST", "seller/products/bulk", 200,
            data={
                "products": [
                    {"name": "Fresh Apples", "unit": "kg", "price": 150.0},
                    {"name": "Green Bananas", "unit": "dozen", "price": 80.0}
                ]
            },
            token=self.seller_token,
            description="Seller adds products that need admin approval"
        )
        if not success or 'products' not in response:
            return False
            
        new_product_ids = [p['id'] for p in response['products']]
        print(f"   📦 Added {len(new_product_ids)} products for approval")

        # Admin approves first product
        success, _ = self.run_test(
            "Admin Approve Product", "POST", f"admin/products/{new_product_ids[0]}/approve", 200,
            token=self.admin_token,
            description="Admin approves the first product"
        )
        if not success:
            return False

        # Admin rejects second product
        success, _ = self.run_test(
            "Admin Reject Product", "POST", f"admin/products/{new_product_ids[1]}/reject", 200,
            token=self.admin_token,
            description="Admin rejects the second product"
        )

        return success
        """Test that roles can't access each other's endpoints"""
        print(f"\n🔒 Testing Role-Based Access Control...")
        
        # Seller tries to access admin endpoint
        success1, _ = self.run_test(
            "RBAC - Seller→Admin (Should Fail)", "GET", "admin/dashboard", 403,
            token=self.seller_token,
            description="Seller tries to access admin dashboard (should fail)"
        )
        
        # Customer tries to access seller endpoint
        success2, _ = self.run_test(
            "RBAC - Customer→Seller (Should Fail)", "GET", "seller/dashboard", 403,
            token=self.customer_token,
            description="Customer tries to access seller dashboard (should fail)"
        )
        
    def test_role_based_access_control(self):
        """Test that roles can't access each other's endpoints"""
        print(f"\n🔒 Testing Role-Based Access Control...")
        
        # Seller tries to access admin endpoint
        success1, _ = self.run_test(
            "RBAC - Seller→Admin (Should Fail)", "GET", "admin/dashboard", 403,
            token=self.seller_token,
            description="Seller tries to access admin dashboard (should fail)"
        )
        
        # Customer tries to access seller endpoint
        success2, _ = self.run_test(
            "RBAC - Customer→Seller (Should Fail)", "GET", "seller/dashboard", 403,
            token=self.customer_token,
            description="Customer tries to access seller dashboard (should fail)"
        )
        
        return success1 and success2

    def print_summary(self):
        """Print test summary"""
        print(f"\n" + "="*60)
        print(f"📊 TEST SUMMARY")
        print(f"="*60)
        print(f"✅ Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"❌ Tests Failed: {len(self.failed_tests)}")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for i, test in enumerate(self.failed_tests, 1):
                print(f"  {i}. {test['name']} ({test['method']} {test.get('endpoint', 'N/A')})")
                if 'expected' in test:
                    print(f"     Expected: {test['expected']}, Got: {test['actual']}")
                if 'error' in test:
                    print(f"     Error: {test['error']}")
        
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        print(f"\n📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    print("🚀 Starting Green Basket API Tests...")
    print("="*60)
    
    tester = GreenBasketAPITester()
    
    # Test sequence following the user flow
    test_sequence = [
        ("Health Check", tester.test_health_check),
        ("Admin Authentication", tester.test_admin_auth),
        ("Admin Dashboard", tester.test_admin_dashboard),
        ("Seller Authentication", tester.test_seller_auth),
        ("Seller Add Products", tester.test_seller_products),
        ("Admin Approve Seller", tester.test_admin_approve_seller),
        ("Admin Approve Products", tester.test_admin_approve_products),
        ("Seller Daily Stock", tester.test_seller_stock_management),
        ("Customer Authentication", tester.test_customer_auth),
        ("Customer Set Location", tester.test_customer_location),
        ("Customer View Products", tester.test_customer_products),
        ("Customer Checkout", tester.test_customer_checkout),
        ("Delivery Authentication", tester.test_delivery_auth),
        ("Admin Approve Delivery", tester.test_admin_approve_delivery),
        ("Delivery Set Available", tester.test_delivery_availability),
        ("Role-Based Access Control", tester.test_role_based_access_control),
    ]
    
    # Run tests
    for test_name, test_func in test_sequence:
        try:
            result = test_func()
            if not result:
                print(f"⚠️  {test_name} failed - continuing with remaining tests...")
        except Exception as e:
            print(f"💥 {test_name} crashed with error: {str(e)}")
            tester.failed_tests.append({
                "name": test_name,
                "error": f"Exception: {str(e)}",
                "method": "N/A"
            })
    
    # Print final summary
    success = tester.print_summary()
    
    # Return appropriate exit code
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())