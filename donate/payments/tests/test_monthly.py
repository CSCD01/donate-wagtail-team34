from selenium import webdriver
import time
# driver = webdriver.FireFox(driver_path)
url = "http://0.0.0.0:8000/"
driver_path = "/Users/xinzheng/Mozilla/donate-wagtail-team34/donate/payments/tests/driver/chromedriver"
driver = webdriver.Chrome(driver_path)
driver.set_page_load_timeout(10)
driver.get(url)
radio_select = driver.find_element_by_id("tab-2")
radio_select.click()
time.sleep(2)
amount_select = driver.find_element_by_xpath('//label[@for="monthly-amount-1"]')
amount_select.click()
time.sleep(2)
visa_select = driver.find_element_by_xpath('//*[@id="donate-form--monthly"]/div[2]/div/button')
visa_select.click()
time.sleep(2)
driver.execute_script("window.history.go(-1)");
time.sleep(2)
driver.close()
print("Test completed successfully!")