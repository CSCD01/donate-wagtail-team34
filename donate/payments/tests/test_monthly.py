from selenium import webdriver
import time
# driver = webdriver.FireFox(driver_path)
url = "http://0.0.0.0:8000/"
driver_path = "./driver/chromedriver"
driver = webdriver.Chrome(driver_path)
driver.set_page_load_timeout(10)
driver.get(url)
# click on the monthly radio button
radio_select = driver.find_element_by_id("tab-2")
radio_select.click()
time.sleep(2)
# select the second option in the monthly tab-panel and click on it
amount_select = driver.find_element_by_xpath('//label[@for="monthly-amount-1"]')
amount_select.click()
time.sleep(2)
# select the visa payment button and click on it
visa_select = driver.find_element_by_xpath('//*[@id="donate-form--monthly"]/div[2]/div/button')
visa_select.click()
time.sleep(2)
# perform the go back action
driver.execute_script("window.history.go(-1)")
time.sleep(2)
# select the second option in the monthly tab-panel
expected_option = driver.find_element_by_xpath('//label[@for="monthly-amount-1"]')
try:
    # only the dispayed/visible elements are clickable
    # perform the click => success!
    expected_option.click()
    print("Test completed successfully!")
except:
    # if click was not successfully performed => the option is not displayed
    print("Monthly options are not displayed! Test failed!")
driver.close()
