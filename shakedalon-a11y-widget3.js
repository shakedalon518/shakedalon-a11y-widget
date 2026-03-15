(function() {
  'use strict';

  // Exclusion selector for site-wide effects (never affects widget itself)
  const EX = ':not(#sa11y-widget-root):not(#sa11y-widget-root *)';

  // Hebrew text using Unicode escapes
  const LABELS = {
    stopAnimations: '\u05E2\u05E6\u05D5\u05E8 \u05D0\u05E0\u05D9\u05DE\u05E6\u05D9\u05D5\u05EA',
    keyboardNav: '\u05E0\u05D9\u05D5\u05D5\u05D8 \u05DE\u05E7\u05DC\u05D3\u05D4',
    textToSpeech: '\u05E7\u05E8\u05D9\u05D0\u05D4 \u05D1\u05E7\u05D5\u05DC',
    monochrome: '\u05E9\u05D7\u05D5\u05E8-\u05DC\u05D1\u05DF',
    highContrast: '\u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA',
    blackYellow: '\u05E9\u05D7\u05D5\u05E8-\u05E6\u05D4\u05D5\u05D1',
    sepia: '\u05E1\u05E4\u05D9\u05D4',
    invert: '\u05D4\u05D9\u05E4\u05D5\u05DA \u05E6\u05D1\u05E2\u05D9\u05DD',
    hideImages: '\u05D4\u05E1\u05EA\u05E8 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA',
    highlightLinks: '\u05D4\u05D3\u05D2\u05E9 \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD',
    highlightHeadings: '\u05D4\u05D3\u05D2\u05E9 \u05DB\u05D5\u05EA\u05E8\u05D5\u05EA',
    readableFont: '\u05D2\u05D5\u05E4\u05DF \u05E7\u05E8\u05D9\u05D0',
    readingGuide: '\u05DE\u05D3\u05E8\u05D9\u05DA \u05E7\u05E8\u05D9\u05D0\u05D4',
    altText: '\u05D8\u05E7\u05E1\u05D8 \u05D7\u05DC\u05D5\u05E4\u05D9',
    largeBlackCursor: '\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC \u05E9\u05D7\u05D5\u05E8',
    largeWhiteCursor: '\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC \u05DC\u05D1\u05DF',
    fontSize: '\u05D2\u05D3\u05D5\u05DC \u05D2\u05D5\u05E4\u05DF',
    lineHeight: '\u05D2\u05D3\u05D5\u05DC \u05D2\u05D5\u05D1\u05D4',
    letterSpacing: '\u05E8\u05D5\u05D7\u05E7 \u05D0\u05D5\u05EA\u05D9\u05D5\u05EA',
    wordSpacing: '\u05E8\u05D5\u05D7\u05E7 \u05D3\u05D1\u05E8\u05D9\u05DD',
    accessibility: '\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA',
    enable: '\u05D4\u05E4\u05E2\u05DC\u05D4',
    close: '\u05E1\u05D2\u05D5\u05E8',
    skipToMain: '\u05D3\u05DC\u05D2 \u05DC\u05E4\u05D8\u05D8\u05D4 \u05D7\u05D3\u05D9\u05E9\u05D4',
    colors: '\u05E6\u05D1\u05E2\u05D9\u05DD',
    typography: '\u05E6\u05D9\u05E4\u05D5\u05D9',
    features: '\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA'
  };

  // Accessibility statements - full modal content
  const A11Y_STATEMENTS = {
    he: {
      title: '\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA',
      lastUpdate: '\u05E2\u05D3\u05DB\u05D5\u05DF \u05D0\u05D7\u05E8\u05D5\u05DF: \u05DE\u05E8\u05E5 2026',
      commitment: {
        title: '\u05D4\u05DE\u05D7\u05D5\u05D9\u05D1\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5',
        text: '\u05D0\u05E0\u05D7\u05E0\u05D5 \u05DE\u05D7\u05D5\u05D9\u05D1\u05D9\u05DD \u05DC\u05D4\u05E4\u05D5\u05DA \u05D0\u05EA \u05D0\u05EA\u05E8\u05D9\u05E0\u05D5 \u05DC\u05E0\u05D2\u05D9\u05E9 \u05DC\u05DB\u05DC\u05DC \u05D4\u05D0\u05E0\u05E9\u05D9\u05DD, \u05D1\u05E2\u05DC\u05D9 \u05D9\u05DB\u05D5\u05DC\u05D5\u05EA \u05D5\u05D1\u05E2\u05DC\u05D9 \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05D9\u05D5\u05EA. \u05D1\u05D0\u05EA\u05E8 \u05D6\u05D4 \u05EA\u05D5\u05DB\u05DC\u05D5 \u05DC\u05DE\u05E6\u05D5\u05D0 \u05D0\u05EA \u05D4\u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4 \u05D4\u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05DC\u05E6\u05E8\u05DB\u05D9\u05DD \u05E9\u05DC\u05DB\u05DD. \u05D0\u05EA\u05E8 \u05D6\u05D4 \u05D4\u05D9\u05E0\u05D5 \u05D0\u05EA\u05E8 \u05E9\u05DE\u05D9\u05E9\u05D9 \u05DC\u05DB\u05DC\u05DC \u05D4\u05D0\u05D5\u05DB\u05DC\u05D5\u05E1\u05D9\u05D9\u05D4 \u05D1\u05E8\u05D5\u05D1\u05D5 \u05D5\u05D1\u05D4\u05E9\u05EA\u05D3\u05DC\u05D5\u05EA \u05DE\u05E7\u05E1\u05D9\u05DE\u05DC\u05D9\u05EA. \u05D9\u05D9\u05EA\u05DB\u05DF \u05D5\u05EA\u05DE\u05E6\u05D0\u05D5 \u05D0\u05DC\u05DE\u05E0\u05D8\u05D9\u05DD \u05E9\u05D0\u05D9\u05E0\u05DD \u05DE\u05D5\u05E0\u05D2\u05E9\u05D9\u05DD \u05DB\u05D9 \u05D8\u05E8\u05DD \u05D4\u05D5\u05E0\u05D2\u05E9\u05D5 \u05D0\u05D5 \u05E9\u05DC\u05D0 \u05E0\u05DE\u05E6\u05D0\u05D4 \u05D8\u05DB\u05E0\u05D5\u05DC\u05D5\u05D2\u05D9\u05D4 \u05DE\u05EA\u05D0\u05D9\u05DE\u05D4 \u05D5\u05DC\u05E6\u05D3 \u05D6\u05D4 \u05D0\u05E0\u05D5 \u05DE\u05D1\u05D8\u05D9\u05D7\u05D9\u05DD \u05DB\u05D9 \u05DE\u05EA\u05D1\u05E6\u05E2\u05D9\u05DD \u05DE\u05E8\u05D1 \u05D4\u05DE\u05D0\u05DE\u05E6\u05D9\u05DD \u05DC\u05E9\u05E4\u05E8 \u05D5\u05DC\u05D4\u05E0\u05D2\u05D9\u05E9 \u05D1\u05E8\u05DE\u05D4 \u05D4\u05D2\u05D1\u05D5\u05D4\u05D4 \u05D1\u05D9\u05D5\u05EA\u05E8 \u05D5\u05D1\u05DC\u05D9 \u05E4\u05E9\u05E8\u05D5\u05EA. \u05D1\u05DE\u05D9\u05D3\u05D4 \u05D5\u05E0\u05EA\u05E7\u05DC\u05EA\u05DD \u05D1\u05E7\u05D5\u05E9\u05D9 \u05D1\u05D2\u05DC\u05D9\u05E9\u05D4 \u05D1\u05D0\u05EA\u05E8 \u05D5\u05E6\u05E4\u05D9\u05D9\u05D4 \u05D1\u05EA\u05D5\u05DB\u05E0\u05D5 \u05D0\u05E0\u05D5 \u05DE\u05EA\u05E0\u05E6\u05DC\u05D9\u05DD \u05D5\u05E0\u05E9\u05DE\u05D7 \u05DE\u05D0\u05D5\u05D3 \u05DB\u05D9 \u05EA\u05E4\u05E0\u05D5 \u05D0\u05EA \u05EA\u05E9\u05D5\u05DE\u05EA \u05DC\u05D9\u05D1\u05E0\u05D5 \u05DC\u05DB\u05DA.\n\nSHAKED ALON DESIGN \u05DE\u05D7\u05D5\u05D9\u05D1\u05EA \u05DC\u05D4\u05D1\u05D8\u05D7\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9\u05EA \u05DC\u05DE\u05E9\u05EA\u05DE\u05E9\u05D9\u05DD \u05E2\u05DD \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05D9\u05D5\u05EA \u05E9\u05D5\u05E0\u05D5\u05EA. \u05D0\u05E0\u05D5 \u05E2\u05D5\u05D1\u05D3\u05D9\u05DD \u05D1\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05EA\u05E7\u05DF \u05EA\"\u05D9 5568 \u05D5\u05D7\u05D5\u05E7 \u05E9\u05D5\u05D5\u05D9\u05D5\u05DF \u05D6\u05DB\u05D5\u05D9\u05D5\u05EA \u05DC\u05D0\u05E0\u05E9\u05D9\u05DD \u05E2\u05DD \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05D9\u05D5\u05EA, \u05D4\u05EA\u05E9\u05E0"\u05D7-1998 (\u05EA\u05D9\u05E7\u05D5\u05DF \u05DE\u05E1\' 18).'
      },
      accessibility: {
        title: '\u05E8\u05DE\u05EA \u05D4\u05D4\u05E0\u05D2\u05E9\u05D4 \u05E9\u05DC\u05E0\u05D5',
        text: '\u05D0\u05EA\u05E8 \u05D6\u05D4 \u05E2\u05D5\u05DE\u05D3 \u05D1\u05D3\u05E8\u05D9\u05E9\u05D5\u05EA WCAG 2.0 \u05D1\u05E8\u05DE\u05D4 AA, \u05D5\u05DB\u05DF \u05D1\u05EA\u05E7\u05DF \u05D4\u05D9\u05E9\u05E8\u05D0\u05DC\u05D9 5568 \u05DC\u05D4\u05E0\u05D2\u05E9\u05D4 \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9\u05EA.'
      },
      features: {
        title: '\u05D4\u05EA\u05D0\u05DE\u05D5\u05EA \u05D6\u05DE\u05D9\u05E0\u05D5\u05EA',
        widgetTitle: '\u05EA\u05DB\u05D5\u05E0\u05D5\u05EA \u05D4\u05D5\u05D5\u05D9\u05D3\u05D2\u05B3\u05D8',
        siteTitle: '\u05EA\u05DB\u05D5\u05E0\u05D5\u05EA \u05D4\u05D0\u05EA\u05E8',
        widget: [
          '\u05E2\u05E6\u05D9\u05E8\u05EA \u05D0\u05E0\u05D9\u05DE\u05E6\u05D9\u05D5\u05EA \u05D5\u05D5\u05D9\u05D3\u05D0\u05D5',
          '\u05D4\u05D3\u05D2\u05E9\u05EA \u05DE\u05E1\u05D2\u05E8\u05D5\u05EA \u05DE\u05DE\u05D5\u05E7\u05D3\u05D5\u05EA \u05DC\u05E0\u05D9\u05D5\u05D5\u05D8 \u05DE\u05E7\u05DC\u05D3\u05EA',
          '\u05E7\u05E8\u05D9\u05D0\u05D4 \u05D1\u05E7\u05D5\u05DC (\u05E2\u05D1\u05E8\u05D9\u05EA/\u05D0\u05E0\u05D2\u05DC\u05D9\u05EA)',
          '\u05DE\u05E1\u05E0\u05E0\u05D9 \u05EA\u05E6\u05D5\u05D2\u05D4: \u05E9\u05D7\u05D5\u05E8-\u05DC\u05D1\u05DF, \u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA \u05D2\u05D1\u05D5\u05D4\u05D4, \u05E9\u05D7\u05D5\u05E8-\u05E6\u05D4\u05D5\u05D1, \u05E1\u05E4\u05D9\u05D4, \u05D4\u05D9\u05E4\u05D5\u05DA \u05E6\u05D1\u05E2\u05D9\u05DD',
          '\u05D4\u05E1\u05EA\u05E8\u05EA \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA',
          '\u05D4\u05D3\u05D2\u05E9\u05EA \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD',
          '\u05D4\u05D3\u05D2\u05E9\u05EA \u05DB\u05D5\u05EA\u05E8\u05D5\u05EA',
          '\u05D2\u05D5\u05E4\u05DF \u05E7\u05E8\u05D9\u05D0',
          '\u05DE\u05D3\u05E8\u05D9\u05DA \u05E7\u05E8\u05D9\u05D0\u05D4 (\u05E1\u05E8\u05D2\u05DC \u05D0\u05D5\u05E4\u05E7\u05D9)',
          '\u05EA\u05E6\u05D5\u05D2\u05EA \u05D8\u05E7\u05E1\u05D8 \u05D7\u05DC\u05D5\u05E4\u05D9 (alt text)',
          '\u05D1\u05E7\u05E8\u05EA \u05D2\u05D5\u05D3\u05DC \u05D2\u05D5\u05E4\u05E0\u05D9\u05DD (80%-200%)'
        ],
        site: [
          '\u05E2\u05D9\u05E6\u05D5\u05D1 \u05E8\u05E1\u05E4\u05D5\u05E0\u05E1\u05D9\u05D1\u05D9',
          '\u05D8\u05E7\u05E1\u05D8 \u05D1\u05E7\u05D5\u05E0\u05D8\u05E8\u05E1\u05D8 \u05D2\u05D1\u05D5\u05D4',
          '\u05E0\u05D9\u05D5\u05D5\u05D8 \u05D1\u05E2\u05D6\u05E8\u05EA \u05DE\u05E7\u05DC\u05D3\u05EA',
          '\u05EA\u05D9\u05D0\u05D5\u05E8 alt \u05DC\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA',
          '\u05DB\u05D5\u05EA\u05E8\u05D5\u05EA \u05DE\u05D5\u05D1\u05E0\u05D5\u05EA (Headings)',
          '\u05E8\u05E9\u05D9\u05DE\u05D5\u05EA \u05DE\u05D5\u05D1\u05E0\u05D5\u05EA',
          '\u05D8\u05D5\u05E4\u05E1 \u05E2\u05DD \u05EA\u05D9\u05D5\u05D2 \u05D1\u05E8\u05D5\u05E8'
        ]
      },
      limitations: {
        title: '\u05DE\u05D2\u05D1\u05DC\u05D5\u05EA \u05D9\u05D3\u05D5\u05E2\u05D5\u05EA',
        text: '\u05D0\u05E0\u05D5 \u05DE\u05D5\u05D3\u05E2\u05D9\u05DD \u05DC\u05E7\u05D9\u05D5\u05DE\u05DF \u05E9\u05DC \u05D4\u05DE\u05D2\u05D1\u05DC\u05D5\u05EA \u05D4\u05D1\u05D0\u05D5\u05EA: \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA \u05DE\u05E1\u05D5\u05D9\u05DE\u05D5\u05EA \u05DC\u05DC\u05D0 \u05EA\u05D9\u05D0\u05D5\u05E8 \u05D7\u05DC\u05D5\u05E4\u05D9 \u05DE\u05E4\u05D5\u05E8\u05E9, \u05EA\u05D5\u05DB\u05DF \u05DE\u05E9\u05DC\u05D9\u05E9\u05D9 \u05E2\u05E9\u05D5\u05D9 \u05E9\u05DC\u05D0 \u05DC\u05D4\u05D9\u05D5\u05EA \u05E0\u05D2\u05D9\u05E9 \u05D1\u05DE\u05DC\u05D5\u05D0\u05D5, \u05E7\u05D1\u05E6\u05D9 PDF \u05DE\u05E1\u05D5\u05D9\u05D9\u05DE\u05D9\u05DD \u05E2\u05E9\u05D5\u05D9\u05D9\u05DD \u05E9\u05DC\u05D0 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05D5\u05D2\u05E0\u05D9\u05DD \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9\u05EA.'
      },
      contact: {
        title: '\u05E8\u05DB\u05D6/\u05EA \u05D4\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5',
        text: '\u05DC\u05E9\u05D0\u05DC\u05D5\u05EA \u05D0\u05D5 \u05D4\u05E6\u05E2\u05D5\u05EA \u05D1\u05E0\u05D5\u05D2\u05E2 \u05DC\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA:',
        name: '\u05E9\u05E7\u05D3 \u05D0\u05DC\u05D5\u05DF',
        email: 'shaked.alon@gmail.com',
        phone: '050-3480865',
        website: 'www.shakedalon.com'
      },
      legal: {
        title: '\u05DE\u05E1\u05D2\u05E8\u05EA \u05DE\u05E9\u05E4\u05D8\u05D9\u05EA',
        items: [
          '\u05D7\u05D5\u05E7 \u05E9\u05D5\u05D5\u05D9\u05D5\u05DF \u05D6\u05DB\u05D5\u05D9\u05D5\u05EA \u05DC\u05D0\u05E0\u05E9\u05D9\u05DD \u05E2\u05DD \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05EA, \u05D4\u05EA\u05E9\u05E0"\u05D7-1998',
          '\u05EA\u05D9\u05E7\u05D5\u05DF \u05DE\u05E1\' 18 \u05DC\u05D7\u05D5\u05E7 \u05E9\u05D5\u05D5\u05D9\u05D5\u05DF \u05D6\u05DB\u05D5\u05D9\u05D5\u05EA \u05DC\u05D0\u05E0\u05E9\u05D9\u05DD \u05E2\u05DD \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05EA',
          '\u05EA\u05E7\u05E0\u05D5\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05DE\u05D9\u05D3\u05E2 \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9, \u05D4\u05EA\u05E9\u05E2"\u05D2-2013',
          '\u05EA\u05E7\u05DF \u05D9\u05E9\u05E8\u05D0\u05DC\u05D9 5568 - \u05D3\u05E8\u05D9\u05E9\u05D5\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05DC\u05EA\u05D5\u05DB\u05DF \u05D5\u05D5\u05D1',
          'Web Content Accessibility Guidelines (WCAG) 2.0 - Level AA'
        ]
      }
    },
    en: {
      title: 'Accessibility Statement',
      lastUpdate: 'Last Updated: March 2026',
      commitment: {
        title: 'Our Commitment',
        text: 'SHAKED ALON DESIGN is committed to ensuring digital accessibility for users with disabilities. We comply with Standard IS 5568 and the Equality Rights Law for Persons with Disabilities, 1998 (Amendment No. 18).'
      },
      accessibility: {
        title: 'Our Accessibility Level',
        text: 'This website meets WCAG 2.0 Level AA standards and Israeli Standard 5568 for digital accessibility.'
      },
      features: {
        title: 'Available Accommodations',
        widgetTitle: 'Widget Features',
        siteTitle: 'Site Features',
        widget: [
          'Stop animations and videos',
          'Highlight focus outlines for keyboard navigation',
          'Text-to-speech (Hebrew/English auto-detection)',
          'Display filters: grayscale, high contrast, black-yellow, sepia, invert colors',
          'Hide images',
          'Highlight links',
          'Highlight headings',
          'Readable font (Arial)',
          'Reading guide (horizontal bar)',
          'Display alt text',
          'Font size control (80%-200%)'
        ],
        site: [
          'Responsive design',
          'High contrast text',
          'Keyboard navigation',
          'Alt text for images',
          'Structured headings',
          'Structured lists',
          'Properly labeled forms'
        ]
      },
      limitations: {
        title: 'Known Limitations',
        text: 'We are aware of the following limitations: some images may lack explicit alt text, third-party content may not be fully accessible, some PDF files may not be digitally protected.'
      },
      contact: {
        title: 'Contact Our Accessibility Coordinator',
        text: 'For questions or suggestions regarding accessibility:',
        name: 'Shaked Alon',
        email: 'shaked.alon@gmail.com',
        phone: '050-3480865',
        website: 'www.shakedalon.com'
      },
      legal: {
        title: 'Legal Framework',
        items: [
          'Equality Rights Law for Persons with Disabilities, 1998',
          'Amendment No. 18 to the Equality Rights Law for Persons with Disabilities',
          'Regulations on Digital Information Accessibility, 2013',
          'Israeli Standard 5568 - Web Content Accessibility Requirements',
          'Web Content Accessibility Guidelines (WCAG) 2.0 - Level AA'
        ]
      }
    }
  };

  // Filter CSS registry (tested & working, keep exactly)
  const FILTER_REGISTRY = {
    monochrome: 'html' + EX + '{filter:grayscale(100%)!important}',
    highcontrast: 'html' + EX + '{filter:contrast(200%)!important}',
    sepia: 'html' + EX + '{filter:sepia(100%)!important}',
    invert: 'html' + EX + '{filter:invert(100%) hue-rotate(180deg)!important}img' + EX + ',video' + EX + '{filter:invert(100%) hue-rotate(180deg)!important}',
    blackyellow: 'html' + EX + '{filter:grayscale(100%) brightness(1.1) sepia(100%) saturate(400%) hue-rotate(0deg) contrast(1.1)!important}'
  };

  // SVG Icons (simple, clear, universally understood)
  const ICONS = {
    pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="3" height="16"/><rect x="15" y="4" width="3" height="16"/></svg>',
    keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="14" rx="2" ry="2"/><line x1="6" y1="11" x2="6" y2="15"/><line x1="10" y1="11" x2="10" y2="15"/><line x1="14" y1="11" x2="14" y2="15"/><line x1="18" y1="11" x2="18" y2="15"/></svg>',
    speaker: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3z"/><path d="M17.5 7.5a4 4 0 0 1 0 9m2-11a8 8 0 0 1 0 13"/></svg>',
    circle: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="currentColor"/><circle cx="12" cy="12" r="10" fill="white" clip-path="polygon(50% 0, 100% 0, 100% 100%, 50% 100%)"/></svg>',
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    square: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="2" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
    image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
    heading: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 4v16h2V13h8v7h2V4h-2v7H6V4H4z"/></svg>',
    font: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l8 20h-2.5l-2-5H8.5l-2 5H4L12 2zm-2 11h4l-2-5-2 5z"/></svg>',
    lines: '<svg viewBox="0 0 24 24" fill="currentColor"><line x1="3" y1="5" x2="21" y2="5" stroke="currentColor" stroke-width="2"/><line x1="3" y1="11" x2="21" y2="11" stroke="currentColor" stroke-width="2"/><line x1="3" y1="17" x2="21" y2="17" stroke="currentColor" stroke-width="2"/></svg>',
    alt: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="2" y="3" width="20" height="14" rx="1"/><text x="12" y="14" font-size="6" fill="white" text-anchor="middle">ALT</text></svg>',
    cursor: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 3l7 16l2-8l8-2z"/></svg>',
    accessibility: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="5.5" r="2"/><path d="M8 10h8M12 10v4l-3 5M12 14l3 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>'
  };

  // State management
  let state = {
    panelOpen: false,
    stopAnimations: false,
    keyboardNav: false,
    textToSpeech: false,
    monochrome: false,
    highcontrast: false,
    blackyellow: false,
    sepia: false,
    invert: false,
    hideImages: false,
    highlightLinks: false,
    highlightHeadings: false,
    readableFont: false,
    readingGuide: false,
    altText: false,
    largeBlackCursor: false,
    largeWhiteCursor: false,
    fontSize: 100,
    lineHeight: 100,
    letterSpacing: 0,
    wordSpacing: 0,
    pausedVideos: []
  };

  // Load state from localStorage
  function loadState() {
    try {
      const stored = localStorage.getItem('sa11y-state');
      if (stored) {
        const parsed = JSON.parse(stored);
        state = Object.assign(state, parsed);
        state.pausedVideos = [];
      }
    } catch (e) {
      console.error('Failed to load accessibility state:', e);
    }
  }

  // Save state to localStorage
  function saveState() {
    try {
      const stateToSave = Object.assign({}, state);
      delete stateToSave.pausedVideos;
      localStorage.setItem('sa11y-state', JSON.stringify(stateToSave));
    } catch (e) {
      console.error('Failed to save accessibility state:', e);
    }
  }

  // Text-to-speech handler
  function onTextSelect() {
    if (!state.textToSpeech) return;
    var sel = window.getSelection().toString().trim();
    if (sel.length > 0 && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      var utterance = new SpeechSynthesisUtterance(sel);
      utterance.lang = /[\u0590-\u05FF]/.test(sel) ? 'he-IL' : 'en-US';
      utterance.rate = 1;
      utterance.pitch = 1;
      try { window.speechSynthesis.speak(utterance); } catch(e) {}
    }
  }

  // Alt text badges (DOM-based, fixed position relative to viewport)
  function showAltBadges() {
    clearAltBadges();
    document.querySelectorAll('img[alt]').forEach(function(img) {
      var alt = img.getAttribute('alt');
      if (!alt || !alt.trim()) return;
      var badge = document.createElement('div');
      badge.className = 'sa11y-alt-badge';
      badge.textContent = 'ALT: ' + alt;
      badge.style.cssText = 'position:absolute;background:#1565c0;color:#fff;padding:4px 8px;border-radius:4px;font-size:11px;z-index:999997;max-width:220px;word-wrap:break-word;pointer-events:none;box-shadow:0 2px 6px rgba(0,0,0,0.2);font-family:sans-serif;direction:ltr;text-align:left;';
      // Append to document.body so positioning works correctly
      document.body.appendChild(badge);
      function positionBadge() {
        var rect = img.getBoundingClientRect();
        badge.style.top = (rect.top + window.scrollY) + 'px';
        badge.style.left = (rect.left + window.scrollX) + 'px';
      }
      positionBadge();
      window.addEventListener('scroll', positionBadge);
      window.addEventListener('resize', positionBadge);
      badge._cleanup = function() {
        window.removeEventListener('scroll', positionBadge);
        window.removeEventListener('resize', positionBadge);
      };
    });
  }

  function clearAltBadges() {
    document.querySelectorAll('.sa11y-alt-badge').forEach(function(b) {
      if (b._cleanup) b._cleanup();
      b.remove();
    });
  }

  // Reading guide - interactive, follows mouse
  function toggleReadingGuide(enabled) {
    if (enabled) {
      var guide = document.getElementById('sa11y-reading-guide');
      if (!guide) {
        guide = document.createElement('div');
        guide.id = 'sa11y-reading-guide';
        guide.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:8px;background:rgba(21,101,192,0.3);pointer-events:none;z-index:999999;display:block;border-top:2px solid #1565c0;border-bottom:2px solid #1565c0';
        var root = document.getElementById('sa11y-widget-root');
        if (root) root.appendChild(guide);
      }
      guide.style.display = 'block';
      document.addEventListener('mousemove', moveReadingGuide);
    } else {
      var guide = document.getElementById('sa11y-reading-guide');
      if (guide) guide.style.display = 'none';
      document.removeEventListener('mousemove', moveReadingGuide);
    }
  }

  function moveReadingGuide(e) {
    var guide = document.getElementById('sa11y-reading-guide');
    if (guide) guide.style.top = (e.clientY - 4) + 'px';
  }

  // Feature CSS Registry
  const featureCSSRegistry = {};

  function setFeatureCSS(name, css) {
    clearFeatureCSS(name);
    const styleId = 'sa11y-fx-' + name;
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = css;
    document.head.appendChild(style);
    featureCSSRegistry[name] = styleId;
  }

  function clearFeatureCSS(name) {
    const styleId = featureCSSRegistry[name];
    if (styleId) {
      const style = document.getElementById(styleId);
      if (style) {
        style.remove();
      }
      delete featureCSSRegistry[name];
    }
  }

  // Apply all active features
  function applyFeatures() {
    // Color filters
    if (state.monochrome) setFeatureCSS('monochrome', FILTER_REGISTRY.monochrome);
    else clearFeatureCSS('monochrome');

    if (state.highcontrast) setFeatureCSS('highcontrast', FILTER_REGISTRY.highcontrast);
    else clearFeatureCSS('highcontrast');

    if (state.sepia) setFeatureCSS('sepia', FILTER_REGISTRY.sepia);
    else clearFeatureCSS('sepia');

    if (state.invert) setFeatureCSS('invert', FILTER_REGISTRY.invert);
    else clearFeatureCSS('invert');

    if (state.blackyellow) setFeatureCSS('blackyellow', FILTER_REGISTRY.blackyellow);
    else clearFeatureCSS('blackyellow');

    // Font size (zoom approach)
    const zoomLevel = state.fontSize / 100;
    const zoomCss = 'body>*:not(#sa11y-widget-root){zoom:' + zoomLevel + '!important}';
    if (state.fontSize !== 100) setFeatureCSS('fontsize', zoomCss);
    else clearFeatureCSS('fontsize');

    // Line height
    if (state.lineHeight !== 100) {
      const lineHeightValue = (state.lineHeight / 100).toFixed(2);
      const lineHeightCss = '*' + EX + '{line-height:' + lineHeightValue + '!important}';
      setFeatureCSS('lineheight', lineHeightCss);
    } else {
      clearFeatureCSS('lineheight');
    }

    // Letter spacing
    if (state.letterSpacing > 0) {
      const letterSpacingCss = '*' + EX + '{letter-spacing:' + state.letterSpacing + 'px!important}';
      setFeatureCSS('letterspacing', letterSpacingCss);
    } else {
      clearFeatureCSS('letterspacing');
    }

    // Word spacing
    if (state.wordSpacing > 0) {
      const wordSpacingCss = '*' + EX + '{word-spacing:' + state.wordSpacing + 'px!important}';
      setFeatureCSS('wordspacing', wordSpacingCss);
    } else {
      clearFeatureCSS('wordspacing');
    }

    // Hide images
    if (state.hideImages) {
      const hideImagesCss = 'img' + EX + '{display:none!important}';
      setFeatureCSS('hideimages', hideImagesCss);
    } else {
      clearFeatureCSS('hideimages');
    }

    // Highlight links
    if (state.highlightLinks) {
      const highlightLinksCss = 'a' + EX + '{outline:2px solid red!important;outline-offset:2px!important}';
      setFeatureCSS('highlightlinks', highlightLinksCss);
    } else {
      clearFeatureCSS('highlightlinks');
    }

    // Highlight headings
    if (state.highlightHeadings) {
      const highlightHeadingsCss = 'h1' + EX + ',h2' + EX + ',h3' + EX + ',h4' + EX + ',h5' + EX + ',h6' + EX + '{outline:2px solid blue!important;outline-offset:2px!important}';
      setFeatureCSS('highlightheadings', highlightHeadingsCss);
    } else {
      clearFeatureCSS('highlightheadings');
    }

    // Reading guide
    if (state.readingGuide) {
      toggleReadingGuide(true);
    } else {
      toggleReadingGuide(false);
    }

    // Alt text - use DOM badges instead of CSS
    if (state.altText) {
      showAltBadges();
    } else {
      clearAltBadges();
    }

    // Text-to-speech CSS (make text selectable)
    if (state.textToSpeech) {
      setFeatureCSS('tts-selection', '*' + EX + '{user-select:text!important;-webkit-user-select:text!important}');
    } else {
      clearFeatureCSS('tts-selection');
    }

    // Large cursors (48x48 for better visibility)
    if (state.largeBlackCursor) {
      const blackCursorCss = '*' + EX + '{cursor:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M3 3l12 30 4.5-12 12-4.5z" fill="black" stroke="white" stroke-width="1.5"/></svg>\') 3 3,auto!important}';
      setFeatureCSS('largeblackcursor', blackCursorCss);
    } else {
      clearFeatureCSS('largeblackcursor');
    }

    if (state.largeWhiteCursor) {
      const whiteCursorCss = '*' + EX + '{cursor:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><path d="M3 3l12 30 4.5-12 12-4.5z" fill="white" stroke="black" stroke-width="2"/></svg>\') 3 3,auto!important}';
      setFeatureCSS('largewhitecursor', whiteCursorCss);
    } else {
      clearFeatureCSS('largewhitecursor');
    }

    // Keyboard navigation outlines
    if (state.keyboardNav) {
      const keyboardNavCss = 'a' + EX + ',button' + EX + ',input' + EX + ',select' + EX + ',textarea' + EX + ',*[tabindex]' + EX + '{outline:3px solid #4A90E2!important;outline-offset:3px!important}';
      setFeatureCSS('keyboardnav', keyboardNavCss);
    } else {
      clearFeatureCSS('keyboardnav');
    }

    // Readable font - apply to ALL elements, not just body
    if (state.readableFont) {
      const readableFontCss = '*' + EX + '{font-family:"Segoe UI",Tahoma,Geneva,Verdana,sans-serif!important}';
      setFeatureCSS('readablefont', readableFontCss);
    } else {
      clearFeatureCSS('readablefont');
    }
  }

  // Animation control
  function applyAnimationStop() {
    if (state.stopAnimations) {
      const videos = document.querySelectorAll('video');
      state.pausedVideos = [];
      videos.forEach(video => {
        if (!video.paused) {
          state.pausedVideos.push(video);
          video.pause();
        }
      });
      const animationCss = '*' + EX + '{animation:none!important;transition:none!important}';
      setFeatureCSS('stopanimations', animationCss);
    } else {
      clearFeatureCSS('stopanimations');
      // Resume videos that we paused - use try/catch and promise handling
      state.pausedVideos.forEach(function(video) {
        if (video && typeof video.play === 'function') {
          try {
            var playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.catch(function() {
                // If autoplay fails, at least reset the video to be playable
                video.muted = true;
                video.play().catch(function() {});
              });
            }
          } catch(e) {}
        }
      });
      // Also check all page videos - if any were paused by us but lost reference
      document.querySelectorAll('video').forEach(function(video) {
        if (video.paused && video.hasAttribute('autoplay')) {
          try {
            var p = video.play();
            if (p !== undefined) p.catch(function() {});
          } catch(e) {}
        }
      });
      state.pausedVideos = [];
    }
  }

  // Toggle feature
  function toggleFeature(featureName) {
    state[featureName] = !state[featureName];
    saveState();

    if (featureName === 'stopAnimations') {
      applyAnimationStop();
    } else if (featureName === 'textToSpeech') {
      if (state.textToSpeech) {
        setFeatureCSS('tts-selection', '*' + EX + '{user-select:text!important;-webkit-user-select:text!important}');
        document.addEventListener('mouseup', onTextSelect);
      } else {
        clearFeatureCSS('tts-selection');
        document.removeEventListener('mouseup', onTextSelect);
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      }
    } else {
      applyFeatures();
    }

    updateUI();
  }

  // Create button
  function createButton(featureName, label, iconKey) {
    const button = document.createElement('button');
    button.className = 'sa11y-button';
    button.setAttribute('data-feature', featureName);
    button.setAttribute('aria-pressed', state[featureName] ? 'true' : 'false');

    const iconSvg = ICONS[iconKey] || ICONS.circle;
    button.innerHTML = '<span class="sa11y-icon">' + iconSvg + '</span><span class="sa11y-label">' + label + '</span>';

    button.addEventListener('click', () => {
      toggleFeature(featureName);
    });

    return button;
  }

  // Create slider
  function createSlider(featureName, label, min, max, step) {
    const container = document.createElement('div');
    container.className = 'sa11y-slider-container';

    const labelEl = document.createElement('label');
    labelEl.className = 'sa11y-slider-label';
    labelEl.textContent = label;

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'sa11y-slider-controls';

    const decreaseBtn = document.createElement('button');
    decreaseBtn.className = 'sa11y-slider-btn';
    decreaseBtn.textContent = '-';
    decreaseBtn.setAttribute('aria-label', label + ' \u05D4\u05E7\u05D8\u05E0\u05D4');
    decreaseBtn.addEventListener('click', () => {
      const newVal = Math.max(min, state[featureName] - step);
      state[featureName] = newVal;
      saveState();
      applyFeatures();
      updateUI();
    });

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'sa11y-slider';
    slider.setAttribute('data-feature', featureName);
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = state[featureName];
    slider.setAttribute('aria-label', label);
    slider.addEventListener('input', (e) => {
      state[featureName] = parseInt(e.target.value, 10);
      saveState();
      applyFeatures();
      updateUI();
    });

    const valueSpan = document.createElement('span');
    valueSpan.className = 'sa11y-slider-value';
    const unit = (featureName === 'letterSpacing' || featureName === 'wordSpacing') ? 'px' : '%';
    valueSpan.textContent = state[featureName] + unit;
    valueSpan.setAttribute('aria-live', 'polite');

    const increaseBtn = document.createElement('button');
    increaseBtn.className = 'sa11y-slider-btn';
    increaseBtn.textContent = '+';
    increaseBtn.setAttribute('aria-label', label + ' \u05D4\u05E2\u05DC\u05D4');
    increaseBtn.addEventListener('click', () => {
      const newVal = Math.min(max, state[featureName] + step);
      state[featureName] = newVal;
      saveState();
      applyFeatures();
      updateUI();
    });

    controlsDiv.appendChild(decreaseBtn);
    controlsDiv.appendChild(slider);
    controlsDiv.appendChild(valueSpan);
    controlsDiv.appendChild(increaseBtn);

    container.appendChild(labelEl);
    container.appendChild(controlsDiv);

    return container;
  }

  // Update UI state
  function updateUI() {
    const buttons = document.querySelectorAll('.sa11y-button');
    buttons.forEach(btn => {
      const featureName = btn.getAttribute('data-feature');
      btn.setAttribute('aria-pressed', state[featureName] ? 'true' : 'false');
      if (state[featureName]) {
        btn.classList.add('sa11y-active');
      } else {
        btn.classList.remove('sa11y-active');
      }
    });

    const sliders = document.querySelectorAll('.sa11y-slider');
    sliders.forEach(slider => {
      const featureName = slider.getAttribute('data-feature');
      slider.value = state[featureName];
      const valueSpan = slider.parentElement.querySelector('.sa11y-slider-value');
      if (valueSpan) {
        const unit = (featureName === 'letterSpacing' || featureName === 'wordSpacing') ? 'px' : '%';
        valueSpan.textContent = state[featureName] + unit;
      }
    });
  }

  // Reset all features
  function resetAll() {
    // Clear all boolean states
    state.stopAnimations = false;
    state.keyboardNav = false;
    state.textToSpeech = false;
    state.monochrome = false;
    state.highcontrast = false;
    state.blackyellow = false;
    state.sepia = false;
    state.invert = false;
    state.hideImages = false;
    state.highlightLinks = false;
    state.highlightHeadings = false;
    state.readableFont = false;
    state.readingGuide = false;
    state.altText = false;
    state.largeBlackCursor = false;
    state.largeWhiteCursor = false;

    // Reset numeric values
    state.fontSize = 100;
    state.lineHeight = 100;
    state.letterSpacing = 0;
    state.wordSpacing = 0;

    // Clean up TTS
    document.removeEventListener('mouseup', onTextSelect);
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // Clean up reading guide
    toggleReadingGuide(false);
    var guide = document.getElementById('sa11y-reading-guide');
    if (guide) guide.remove();

    // Clean up alt badges
    clearAltBadges();

    // Resume paused videos
    state.pausedVideos.forEach(function(video) {
      if (video && typeof video.play === 'function') {
        video.play();
      }
    });
    state.pausedVideos = [];

    // Clear all CSS
    Object.keys(featureCSSRegistry).forEach(function(key) {
      clearFeatureCSS(key);
    });

    // Save and update
    saveState();
    updateUI();
  }

  // Add focus trap for keyboard navigation
  function setupFocusTrap(panel) {
    document.addEventListener('keydown', (e) => {
      if (!state.panelOpen) {
        return;
      }

      if (e.key === 'Escape') {
        togglePanel();
      }

      if (e.key === 'Tab' && panel.contains(document.activeElement)) {
        const focusableElements = panel.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
        if (focusableElements.length === 0) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Toggle panel
  function togglePanel() {
    state.panelOpen = !state.panelOpen;
    const panel = document.getElementById('sa11y-panel');
    const trigger = document.getElementById('sa11y-trigger');

    if (state.panelOpen) {
      panel.classList.add('sa11y-open');
      panel.setAttribute('aria-hidden', 'false');
      trigger.setAttribute('aria-expanded', 'true');
      const firstButton = panel.querySelector('button');
      if (firstButton && firstButton !== trigger) {
        setTimeout(() => firstButton.focus(), 100);
      }
    } else {
      panel.classList.remove('sa11y-open');
      panel.setAttribute('aria-hidden', 'true');
      trigger.setAttribute('aria-expanded', 'false');
      if (trigger) {
        trigger.focus();
      }
    }
  }

  // Add skip to main link
  function addSkipToMainLink() {
    let skipLink = document.getElementById('sa11y-skip-to-main');
    if (!skipLink) {
      skipLink = document.createElement('a');
      skipLink.id = 'sa11y-skip-to-main';
      skipLink.href = '#main';
      skipLink.textContent = LABELS.skipToMain;
      skipLink.setAttribute('tabindex', '0');
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }

  // Modal state
  let currentStatementLang = 'he';

  // Show accessibility statement modal
  function showAccessibilityModal() {
    let modal = document.getElementById('sa11y-statement-modal');
    if (modal) {
      modal.remove();
    }

    modal = document.createElement('div');
    modal.id = 'sa11y-statement-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-label', 'Accessibility Statement');
    modal.setAttribute('aria-modal', 'true');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000000;pointer-events:auto;';

    const content = document.createElement('div');
    content.style.cssText = 'background:white;border-radius:8px;max-width:600px;max-height:80vh;overflow-y:auto;padding:30px;box-shadow:0 20px 60px rgba(0,0,0,0.3);direction:rtl;';

    const header = document.createElement('div');
    header.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;';

    const title = document.createElement('h2');
    title.style.cssText = 'margin:0;font-size:22px;color:#333;';
    const stmt = A11Y_STATEMENTS[currentStatementLang];
    title.textContent = stmt.title;

    const langToggle = document.createElement('div');
    langToggle.style.cssText = 'display:flex;gap:10px;';

    const heBtn = document.createElement('button');
    heBtn.textContent = '\u05E2\u05D1\u05E8\u05D9\u05EA';
    heBtn.style.cssText = 'padding:6px 12px;border:1px solid #ddd;background:' + (currentStatementLang === 'he' ? '#667eea;color:white' : 'white;color:#333') + ';border-radius:4px;cursor:pointer;font-weight:500;';
    heBtn.addEventListener('click', function() {
      currentStatementLang = 'he';
      modal.remove();
      showAccessibilityModal();
    });

    const enBtn = document.createElement('button');
    enBtn.textContent = 'English';
    enBtn.style.cssText = 'padding:6px 12px;border:1px solid #ddd;background:' + (currentStatementLang === 'en' ? '#667eea;color:white' : 'white;color:#333') + ';border-radius:4px;cursor:pointer;font-weight:500;';
    enBtn.addEventListener('click', function() {
      currentStatementLang = 'en';
      modal.remove();
      showAccessibilityModal();
    });

    langToggle.appendChild(heBtn);
    langToggle.appendChild(enBtn);

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '\u00D7';
    closeBtn.style.cssText = 'background:none;border:none;font-size:28px;cursor:pointer;color:#666;padding:0;width:32px;height:32px;';
    closeBtn.addEventListener('click', function() {
      modal.remove();
    });

    header.appendChild(langToggle);
    header.appendChild(closeBtn);

    content.appendChild(header);

    // Add last update
    const lastUpdate = document.createElement('div');
    lastUpdate.style.cssText = 'font-size:12px;color:#999;margin-bottom:20px;';
    lastUpdate.textContent = stmt.lastUpdate;
    content.appendChild(lastUpdate);

    // Add sections
    function addSection(title, text) {
      const section = document.createElement('div');
      section.style.cssText = 'margin-bottom:20px;';
      const sectionTitle = document.createElement('h3');
      sectionTitle.style.cssText = 'margin:0 0 10px 0;font-size:16px;color:#333;';
      sectionTitle.textContent = title;
      section.appendChild(sectionTitle);
      const sectionText = document.createElement('p');
      sectionText.style.cssText = 'margin:0;font-size:13px;color:#666;line-height:1.6;';
      sectionText.textContent = text;
      section.appendChild(sectionText);
      content.appendChild(section);
    }

    function addListSection(title, items) {
      const section = document.createElement('div');
      section.style.cssText = 'margin-bottom:20px;';
      const sectionTitle = document.createElement('h3');
      sectionTitle.style.cssText = 'margin:0 0 10px 0;font-size:16px;color:#333;';
      sectionTitle.textContent = title;
      section.appendChild(sectionTitle);
      const ul = document.createElement('ul');
      ul.style.cssText = 'margin:0;padding-right:20px;font-size:13px;color:#666;line-height:1.6;';
      items.forEach(function(item) {
        const li = document.createElement('li');
        li.textContent = item;
        ul.appendChild(li);
      });
      section.appendChild(ul);
      content.appendChild(section);
    }

    addSection(stmt.commitment.title, stmt.commitment.text);
    addSection(stmt.accessibility.title, stmt.accessibility.text);
    addListSection(stmt.features.widgetTitle, stmt.features.widget);
    addListSection(stmt.features.siteTitle, stmt.features.site);
    addSection(stmt.limitations.title, stmt.limitations.text);
    addSection(stmt.contact.title, stmt.contact.text + '\n' + stmt.contact.name + '\n' + stmt.contact.email + '\n' + stmt.contact.phone + '\n' + stmt.contact.website);
    addListSection(stmt.legal.title, stmt.legal.items);

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close on escape
    document.addEventListener('keydown', function closeOnEscape(e) {
      if (e.key === 'Escape') {
        modal.remove();
        document.removeEventListener('keydown', closeOnEscape);
      }
    });

    // Close on outside click
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  // Initialize widget
  function init() {
    // Load saved state
    loadState();

    // Create root container
    let root = document.getElementById('sa11y-widget-root');
    if (root) {
      root.remove();
    }

    root = document.createElement('div');
    root.id = 'sa11y-widget-root';
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', LABELS.accessibility);
    document.body.appendChild(root);

    // Add widget styles
    const widgetStyles = document.createElement('style');
    widgetStyles.id = 'sa11y-widget-styles';
    widgetStyles.textContent = `
#sa11y-widget-root {
  all: revert;
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 999999;
  pointer-events: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
  direction: rtl;
}

#sa11y-widget-root * {
  box-sizing: border-box;
}

#sa11y-trigger {
  pointer-events: auto;
  position: absolute;
  bottom: 0;
  right: 0;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  padding: 0;
  flex-shrink: 0;
}

#sa11y-trigger:hover {
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.6);
  transform: scale(1.05);
}

#sa11y-trigger:focus {
  outline: 3px solid #4A90E2;
  outline-offset: 2px;
}

#sa11y-trigger svg {
  width: 28px;
  height: 28px;
  stroke: white;
  stroke-width: 1.5;
  fill: currentColor;
}

#sa11y-panel {
  pointer-events: auto;
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 320px;
  max-height: 70vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 20px;
  opacity: 0;
  transform: translateY(20px);
  pointer-events: none;
  transition: all 0.3s ease;
  overflow-y: auto;
}

#sa11y-panel.sa11y-open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

#sa11y-panel::-webkit-scrollbar {
  width: 6px;
}

#sa11y-panel::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

#sa11y-panel::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 3px;
}

#sa11y-panel::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

#sa11y-panel-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 12px;
}

#sa11y-panel-header svg {
  width: 24px;
  height: 24px;
  color: #667eea;
  flex-shrink: 0;
  stroke: currentColor;
  stroke-width: 1.5;
  fill: currentColor;
}

#sa11y-panel-title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin: 0;
  flex: 1;
}

.sa11y-close-btn {
  pointer-events: auto;
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  font-size: 24px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  flex-shrink: 0;
}

.sa11y-close-btn:hover {
  color: #333;
}

.sa11y-close-btn:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

.sa11y-section {
  margin-bottom: 20px;
}

.sa11y-section-title {
  font-size: 12px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.7;
}

.sa11y-button-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.sa11y-button {
  pointer-events: auto;
  padding: 12px 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  color: #333;
  font-size: 11px;
  text-align: center;
  line-height: 1.3;
  min-height: 70px;
  justify-content: center;
}

.sa11y-button:hover {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
}

.sa11y-button:focus {
  outline: 2px solid #4A90E2;
  outline-offset: -2px;
}

.sa11y-button.sa11y-active {
  background: #667eea;
  color: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.sa11y-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.sa11y-icon svg {
  width: 100%;
  height: 100%;
  stroke: currentColor;
  stroke-width: 1.5;
  fill: currentColor;
}

.sa11y-label {
  font-weight: 500;
  display: block;
}

.sa11y-slider-container {
  margin-bottom: 16px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
}

.sa11y-slider-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.sa11y-slider-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sa11y-slider {
  pointer-events: auto;
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #ddd;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.sa11y-slider:focus {
  outline: 2px solid #4A90E2;
}

.sa11y-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sa11y-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.sa11y-slider-btn {
  pointer-events: auto;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  transition: background 0.2s;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sa11y-slider-btn:hover {
  background: #764ba2;
}

.sa11y-slider-btn:focus {
  outline: 2px solid #4A90E2;
  outline-offset: 2px;
}

.sa11y-slider-value {
  font-size: 12px;
  font-weight: 600;
  color: #333;
  min-width: 45px;
  text-align: center;
}

.sa11y-statement {
  font-size: 10px;
  color: #666;
  border-top: 1px solid #eee;
  padding-top: 12px;
  margin-top: 12px;
  line-height: 1.4;
}

.sa11y-statement-he {
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.sa11y-statement-en {
  font-size: 9px;
  opacity: 0.8;
  color: #666;
}

#sa11y-skip-to-main {
  pointer-events: auto;
  position: fixed;
  top: -40px;
  left: 0;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  z-index: 999998;
  font-size: 14px;
  transition: top 0.3s;
}

#sa11y-skip-to-main:focus {
  top: 0;
}

@media (max-width: 600px) {
  #sa11y-widget-root {
    bottom: 0;
    right: 0;
    left: 0;
  }

  #sa11y-trigger {
    width: 48px;
    height: 48px;
    border-radius: 0;
  }

  #sa11y-trigger svg {
    width: 24px;
    height: 24px;
  }

  #sa11y-panel {
    width: 100%;
    bottom: 48px;
    border-radius: 8px 8px 0 0;
    max-height: 70vh;
  }

  .sa11y-button-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
    `;
    root.appendChild(widgetStyles);

    // Create trigger button
    const trigger = document.createElement('button');
    trigger.id = 'sa11y-trigger';
    trigger.setAttribute('aria-label', LABELS.accessibility);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('title', LABELS.accessibility);
    trigger.innerHTML = ICONS.accessibility;
    trigger.addEventListener('click', togglePanel);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel();
      }
    });
    root.appendChild(trigger);

    // Create panel
    const panel = document.createElement('div');
    panel.id = 'sa11y-panel';
    panel.setAttribute('aria-hidden', 'true');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', LABELS.accessibility);
    panel.setAttribute('aria-modal', 'true');

    // Header
    const header = document.createElement('div');
    header.id = 'sa11y-panel-header';
    header.innerHTML = '<span>' + ICONS.accessibility + '</span><h1 class="sa11y-panel-title">' + LABELS.accessibility + '</h1>';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'sa11y-close-btn';
    closeBtn.setAttribute('aria-label', LABELS.close);
    closeBtn.textContent = '\u00D7';
    closeBtn.addEventListener('click', togglePanel);
    closeBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePanel();
      }
    });
    header.appendChild(closeBtn);

    panel.appendChild(header);

    // Color filters section
    const colorSection = document.createElement('div');
    colorSection.className = 'sa11y-section';
    const colorTitle = document.createElement('div');
    colorTitle.className = 'sa11y-section-title';
    colorTitle.textContent = LABELS.colors;
    colorSection.appendChild(colorTitle);

    const colorGrid = document.createElement('div');
    colorGrid.className = 'sa11y-button-grid';
    colorGrid.appendChild(createButton('monochrome', LABELS.monochrome, 'circle'));
    colorGrid.appendChild(createButton('highcontrast', LABELS.highContrast, 'sun'));
    colorGrid.appendChild(createButton('blackyellow', LABELS.blackYellow, 'square'));
    colorGrid.appendChild(createButton('sepia', LABELS.sepia, 'image'));
    colorGrid.appendChild(createButton('invert', LABELS.invert, 'link'));
    colorSection.appendChild(colorGrid);
    panel.appendChild(colorSection);

    // Typography section
    const typographySection = document.createElement('div');
    typographySection.className = 'sa11y-section';
    const typographyTitle = document.createElement('div');
    typographyTitle.className = 'sa11y-section-title';
    typographyTitle.textContent = LABELS.typography;
    typographySection.appendChild(typographyTitle);

    const fontSizeSlider = createSlider('fontSize', LABELS.fontSize, 80, 200, 10);
    fontSizeSlider.querySelector('.sa11y-slider').setAttribute('data-feature', 'fontSize');
    typographySection.appendChild(fontSizeSlider);

    const lineHeightSlider = createSlider('lineHeight', LABELS.lineHeight, 100, 300, 25);
    lineHeightSlider.querySelector('.sa11y-slider').setAttribute('data-feature', 'lineHeight');
    typographySection.appendChild(lineHeightSlider);

    const letterSpacingSlider = createSlider('letterSpacing', LABELS.letterSpacing, 0, 10, 1);
    letterSpacingSlider.querySelector('.sa11y-slider').setAttribute('data-feature', 'letterSpacing');
    typographySection.appendChild(letterSpacingSlider);

    const wordSpacingSlider = createSlider('wordSpacing', LABELS.wordSpacing, 0, 10, 1);
    wordSpacingSlider.querySelector('.sa11y-slider').setAttribute('data-feature', 'wordSpacing');
    typographySection.appendChild(wordSpacingSlider);

    panel.appendChild(typographySection);

    // Features section
    const featuresSection = document.createElement('div');
    featuresSection.className = 'sa11y-section';
    const featuresTitle = document.createElement('div');
    featuresTitle.className = 'sa11y-section-title';
    featuresTitle.textContent = LABELS.features;
    featuresSection.appendChild(featuresTitle);

    const featuresGrid = document.createElement('div');
    featuresGrid.className = 'sa11y-button-grid';
    featuresGrid.appendChild(createButton('stopAnimations', LABELS.stopAnimations, 'pause'));
    featuresGrid.appendChild(createButton('keyboardNav', LABELS.keyboardNav, 'keyboard'));
    featuresGrid.appendChild(createButton('readableFont', LABELS.readableFont, 'font'));
    featuresGrid.appendChild(createButton('hideImages', LABELS.hideImages, 'image'));
    featuresGrid.appendChild(createButton('highlightLinks', LABELS.highlightLinks, 'link'));
    featuresGrid.appendChild(createButton('highlightHeadings', LABELS.highlightHeadings, 'heading'));
    featuresGrid.appendChild(createButton('readingGuide', LABELS.readingGuide, 'lines'));
    featuresGrid.appendChild(createButton('altText', LABELS.altText, 'alt'));
    featuresGrid.appendChild(createButton('largeBlackCursor', LABELS.largeBlackCursor, 'cursor'));
    featuresGrid.appendChild(createButton('largeWhiteCursor', LABELS.largeWhiteCursor, 'cursor'));
    featuresSection.appendChild(featuresGrid);
    panel.appendChild(featuresSection);

    // TTS button (add it to features before footer)
    featuresGrid.appendChild(createButton('textToSpeech', LABELS.textToSpeech, 'speaker'));

    // Footer with reset and statement buttons
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;gap:10px;margin-top:20px;border-top:1px solid #eee;padding-top:15px;';

    const resetBtn = document.createElement('button');
    resetBtn.className = 'sa11y-footer-btn';
    resetBtn.setAttribute('aria-label', '\u05D0\u05D9\u05E4\u05D5\u05E1');
    resetBtn.style.cssText = 'flex:1;padding:10px;background:#f0f0f0;border:1px solid #ddd;border-radius:4px;cursor:pointer;font-weight:600;color:#333;font-size:12px;transition:all 0.2s;';
    resetBtn.textContent = '\u05D0\u05D9\u05E4\u05D5\u05E1';
    resetBtn.addEventListener('click', resetAll);
    resetBtn.addEventListener('mouseover', function() {
      resetBtn.style.background = '#e0e0e0';
    });
    resetBtn.addEventListener('mouseout', function() {
      resetBtn.style.background = '#f0f0f0';
    });

    const statementBtn = document.createElement('button');
    statementBtn.className = 'sa11y-footer-btn';
    statementBtn.setAttribute('aria-label', '\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA');
    statementBtn.style.cssText = 'flex:1;padding:10px;background:#667eea;border:1px solid #667eea;border-radius:4px;cursor:pointer;font-weight:600;color:white;font-size:12px;transition:all 0.2s;';
    statementBtn.textContent = '\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA';
    statementBtn.addEventListener('click', showAccessibilityModal);
    statementBtn.addEventListener('mouseover', function() {
      statementBtn.style.background = '#764ba2';
    });
    statementBtn.addEventListener('mouseout', function() {
      statementBtn.style.background = '#667eea';
    });

    footer.appendChild(resetBtn);
    footer.appendChild(statementBtn);
    panel.appendChild(footer);

    root.appendChild(panel);

    // Add skip to main link
    addSkipToMainLink();

    // Setup focus trap
    setupFocusTrap(panel);

    // Apply saved state
    applyFeatures();
    if (state.stopAnimations) {
      applyAnimationStop();
    }

    // Update trigger button accessibility
    trigger.setAttribute('aria-expanded', state.panelOpen ? 'true' : 'false');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
