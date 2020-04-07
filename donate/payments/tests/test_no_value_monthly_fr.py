from selenium import webdriver
import time

url = "http://0.0.0.0:8000/fr"
# user can choose webdriver of chrome or firefox
driver_path = './driver/chromedriver'
driver = webdriver.Chrome(driver_path)
driver.set_page_load_timeout(10)
driver.get(url)
print("Test start\n");
# click on the monthly radio button
radio_select = driver.find_element_by_id("tab-2")
radio_select.click()
time.sleep(2)
# select the visa payment button and click on it
visa_select = driver.find_element_by_xpath('//*[@id="donate-form--monthly"]/div[2]/div/button')
visa_select.click()
time.sleep(2)
expect = driver.find_element_by_id("payments__braintree-errors-paypal")
if(expect.text == "No amount selected! Please select a donation amount!"):
    print("Test SUCCESS!\n");
else:
    # if no proper error display then test fail
    print("No error message shows on Monthly panel. Test Failed!\n");
driver.close()