from selenium import webdriver
import time
# driver = webdriver.FireFox(driver_path)
url = "http://0.0.0.0:8000/"
driver_path = "./driver/chromedriver"
driver = webdriver.Chrome(driver_path)
driver.set_page_load_timeout(10)
driver.get(url)
# click on the one-time radio button
radio_select = driver.find_element_by_id("tab-1")
radio_select.click()
time.sleep(2)
# select the visa payment button and click on it
visa_select = driver.find_element_by_class_name("button__icons")
visa_select.click()
time.sleep(2)
# select the second option in the one-time tab-panel
expected_option = driver.find_element_by_xpath('//label[@for="one-time-amount-1"]')
try:
    # only the dispayed/visible elements are clickable
    # perform the click => success!
    expected_option.click()
    print("Test completed successfully!")
except:
    # if click was not successfully performed => the option is not displayed
    print("One-time options do not exist! Test failed!")
driver.close()
