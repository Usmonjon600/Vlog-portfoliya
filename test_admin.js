const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('public/admin.html', 'utf8');
const js = fs.readFileSync('public/js/admin.js', 'utf8');

const dom = new JSDOM(html, { runScripts: "outside-only" });
const window = dom.window;
global.window = window;
global.document = window.document;
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

try {
    window.eval(js);
    console.log("Script executed successfully without throwing top-level errors.");
    
    // Trigger DOMContentLoaded
    const event = window.document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    window.document.dispatchEvent(event);
    
    console.log("DOMContentLoaded dispatched successfully.");
    
    // Simulate keyboard press
    const keyEvent = window.document.createEvent('Event');
    keyEvent.initEvent('keydown', true, true);
    keyEvent.key = '1';
    window.document.dispatchEvent(keyEvent);
    
    const dots = window.document.querySelectorAll('.dot.filled');
    console.log("Filled dots count after keypress 1: " + dots.length);
    
} catch (e) {
    console.error("Execution error: ", e);
}
