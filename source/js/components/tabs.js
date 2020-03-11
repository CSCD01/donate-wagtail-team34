import gaEvent from "./analytics";

class Tabs {
  static selector() {
    return ".js-tab-item";
  }

  constructor(node) {
    this.tab = node;
    // initialize a new bool variable to trace if the radio has been activated in constructor
    this.checkActive = false;
    this.tabset = this.tab.closest(".js-tabs");
    this.allTabs = this.tabset.querySelectorAll(".js-tab-item");
    let tabPanelId = this.tab.getAttribute("aria-controls");
    this.tabPanel = document.getElementById(tabPanelId);
    this.allTabPanels = this.tabset.querySelectorAll(".js-tab-panel");
    this.bindEvents();
  }
  // add getter function to retrieve checkActive value
  getFlag(){
    return this.checkActive;
  }
    // add getter function to retrieve Tab object
  getTab(){
    return this.tab;
  }
  
  bindEvents() {
    this.tab.addEventListener("click", e => {
      for (let tab of this.allTabs) {
        tab.classList.remove("active");
        tab.setAttribute("aria-selected", "false");
      }

      for (let tabPanel of this.allTabPanels) {
        tabPanel.classList.add("tabs__panel--hidden");
      }
      // retrieve tab id 
      // check if the tab id is monthly, if yes change value to true
      // if its tab-1, then change one-time to true indicating the latest action done by user is
      // clicking on one-time radio button
      let id = this.tab.id;
      if(id === "tab-2") {
        this.checkActive = true;
        localStorage.setItem("single", 'false');
      } else {
        localStorage.setItem('single', "true");
      }
      console.log('this tab:', this.tab);
      console.log( 'its flag',this.checkActive);
      this.tab.classList.add("active");
      this.tab.setAttribute("aria-selected", "true");
      this.tabPanel.classList.remove("tabs__panel--hidden");
      
      gaEvent({
        eventCategory: "User Flow",
        eventAction: "Changed Frequency",
        eventLabel: this.tab.getAttribute("data-label")
      });
    });
  }
}

export default Tabs;
