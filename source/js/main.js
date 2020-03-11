import "babel-polyfill";
import * as Sentry from "@sentry/browser";

import Tabs from "./components/tabs";
import MenuToggle from "./components/menu-toggle";
import AmountToggle from "./components/donation-amount-toggle";
import CurrencySelect from "./components/currency-selector";
import WayPointDetect from "./components/waypoint-detection";
import DonationCurrencyWidth from "./components/donation-currency-width";
import CopyURL from "./components/copy-url";
import Accordion from "./components/accordion";
import "./components/newsletter";
import fetchEnv from "./components/env";

// Manage tab index for primary nav
function tabIndexer() {
  document.querySelectorAll("[data-nav-tab-index]").forEach(navLink => {
    navLink.tabIndex = "-1";
  });
}

// Open the mobile menu callback
function openMenu() {
  document.querySelector("[data-primary-nav]").classList.add("is-visible");
  document.querySelectorAll("[data-nav-tab-index]").forEach(navLink => {
    navLink.removeAttribute("tabindex");
  });
}

// Close the mobile menu callback
function closeMenu() {
  document.querySelector("[data-primary-nav]").classList.remove("is-visible");
  tabIndexer();
}
// initialize a list to store all taps objects
var tabsArray = [];
var monthly = false;
document.addEventListener("DOMContentLoaded", function() {
  // get two tab instances from its id
  // check whether the localStorage has the key "monthly"
  // if yes, it means that monthly panel has been activated before go back
  // remove hidden for "monthly" panel, otherwise, remove hidden for "one-time" panel
  if (document.title === "Donate today | Donate to Mozilla"){
    let donate_frequency = localStorage.getItem('monthly');
    let tab_panel_1 = document.getElementById("tab-panel-1");
    let tab_panel_2 = document.getElementById("tab-panel-2");
    if (donate_frequency){
      if(donate_frequency === 'true'){
        if (tab_panel_2.classList.contains("tabs__panel--hidden")){
          tab_panel_1.classList.add("tabs__panel--hidden");
          tab_panel_2.classList.remove("tabs__panel--hidden");
        }else{
          if(tab_panel_1.classList.contains("tabs__panel--hidden")){
          tab_panel_2.classList.add("tabs__panel--hidden");
          tab_panel_1.classList.remove("tabs_panel--hidden");
        }
      }
    }
  }
}
  const gaMeta = document.querySelector(`meta[name="ga-identifier"]`);
  if (gaMeta) {
    let gaIdentifier = gaMeta.getAttribute(`content`);
    initializeGA(gaIdentifier);
  }
  // Initialize Sentry error reporting

  fetchEnv(envData => {
    if (!envData.SENTRY_DSN) {
      return;
    }

    Sentry.init({
      dsn: envData.SENTRY_DSN,
      release: envData.RELEASE_VERSION,
      environment: envData.SENTRY_ENVIRONMENT
    });
  });

  for (const menutoggle of document.querySelectorAll(MenuToggle.selector())) {
    new MenuToggle(menutoggle, openMenu, closeMenu);
  }

  for (const currencywidth of document.querySelectorAll(
    DonationCurrencyWidth.selector()
  )) {
    new DonationCurrencyWidth(currencywidth);
  }

  for (const donatetoggle of document.querySelectorAll(
    AmountToggle.selector()
  )) {
    new AmountToggle(donatetoggle);
  }

  for (const tabs of document.querySelectorAll(Tabs.selector())) {
    tabsArray.push(new Tabs(tabs));
  }

  tabIndexer();

//loop through the array to check if the "monthly" panel has been activated
// if yes, set a key"monthly" and its corresponding value "true" in localStorage for further implementation 
  window.addEventListener("unload", function() {
    tabsArray.forEach(tabObj => {
      var tab = tabObj.getTab();
      if (tab.id === 'tab-2') {
        monthly = tabObj.getFlag();
        this.localStorage.setItem('monthly', "true" ? monthly : "false");
      }
    })
  });

  for (const currencySelect of document.querySelectorAll(
    CurrencySelect.selector()
  )) {
    new CurrencySelect(currencySelect);
  }

  WayPointDetect();

  for (const accordion of document.querySelectorAll(Accordion.selector())) {
    new Accordion(accordion);
  }

  for (const copyurl of document.querySelectorAll(CopyURL.selector())) {
    new CopyURL(copyurl);
  }
  monthly = true;
});

// Google Analytics
function initializeGA(trackingId) {
  var doNotTrack =
    navigator.doNotTrack || navigator.msDoNotTrack || window.doNotTrack;
  if (!doNotTrack || doNotTrack === "no" || doNotTrack === "unspecified") {
    (function(i, s, o, g, r, a, m) {
      i["GoogleAnalyticsObject"] = r;
      (i[r] =
        i[r] ||
        function() {
          (i[r].q = i[r].q || []).push(arguments);
        }),
        (i[r].l = 1 * new Date());
      (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m);
    })(
      window,
      document,
      "script",
      "https://www.google-analytics.com/analytics.js",
      "ga"
    );

    if (typeof ga === "function") {
      ga("create", trackingId, "auto");

      // Ensure we don't pass the email query param to Google Analytics
      var loc = window.location,
        protocol = loc.protocol,
        hostname = loc.hostname,
        pathname = loc.pathname,
        filteredQueryParams = loc.search
          .substring(1)
          .split("&")
          .filter(param => !param.startsWith("email"))
          .join("&");

      ga(
        "set",
        "location",
        `${protocol}//${hostname}${pathname}?${filteredQueryParams}`
      );
      ga("send", "pageview");
      ga("require", "ecommerce");

      // Check for any events sent by the view, and fire them.
      var gaEventsNode = document.getElementById("ga-events");
      if (gaEventsNode) {
        var events = JSON.parse(gaEventsNode.textContent);
        events.forEach(eventArray => {
          ga(...eventArray);
        });
      }

      // Click events
      for (const a of document.querySelectorAll(".js-ga-track-click")) {
        a.addEventListener("click", e => {
          ga("send", "event", {
            eventCategory: a.getAttribute("data-ga-category"),
            eventAction: a.getAttribute("data-ga-action"),
            eventLabel: a.getAttribute("data-ga-label"),
            transport: "beacon"
          });
        });
      }
    }
  }
}
