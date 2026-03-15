/**
 * SHAKED ALON ACCESSIBILITY WIDGET
 * Version: 2.0.0
 * Date: 2026-03-15
 * Author: SHAKED ALON DESIGN
 * Purpose: Complete accessibility solution for shakedalon.com
 * Compliance: Israeli Standard 5568 (IS 5568), WCAG 2.0 Level AA
 *
 * Architecture:
 * - Single IIFE injecting all DOM, CSS, and JS
 * - All widget DOM lives inside #sa11y-widget-root
 * - Site effects applied ONLY through <style> elements (no inline styles)
 * - Each feature has its own <style id="sa11y-fx-{name}">
 * - Reset clears all style elements, restoring 100% original state
 * - Exclusion selector prevents widget from affecting itself
 */

(function() {
  'use strict';

  // ============================================================================
  // CONSTANTS
  // ============================================================================

  const WIDGET_ROOT_ID = 'sa11y-widget-root';
  const PANEL_ID = 'sa11y-panel';
  const TRIGGER_ID = 'sa11y-trigger';
  const STATE_KEY = 'sa11y-state';
  const EX = ':not(#sa11y-widget-root):not(#sa11y-widget-root *)';

  const COLORS = {
    primary: '#1565c0',
    white: '#fff',
    dark: '#222',
    lightGray: '#999',
    mediumGray: '#555'
  };

  // ============================================================================
  // FEATURE STYLE REGISTRY
  // ============================================================================

  const featureStyles = {};

  function setFeatureCSS(name, css) {
    if (!featureStyles[name]) {
      featureStyles[name] = document.createElement('style');
      featureStyles[name].id = 'sa11y-fx-' + name;
      document.head.appendChild(featureStyles[name]);
    }
    featureStyles[name].textContent = css;
  }

  function clearFeatureCSS(name) {
    if (featureStyles[name]) {
      featureStyles[name].textContent = '';
    }
  }

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const state = {
    panelOpen: false,
    animationsStopped: false,
    keyboardNavigation: false,
    ttsActive: false,
    monochromeEnabled: false,
    highContrastEnabled: false,
    blackYellowEnabled: false,
    sepiaEnabled: false,
    invertEnabled: false,
    hideImagesEnabled: false,
    highlightLinksEnabled: false,
    highlightHeadingsEnabled: false,
    readableFontEnabled: false,
    readingGuideEnabled: false,
    altTextEnabled: false,
    fontSizePercent: 100,
    lineHeightPercent: 100,
    letterSpacingPx: 0,
    wordSpacingPx: 0,
    cursorType: null,
    statementOpen: false,
    statementLang: 'he'
  };

  function saveState() {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify(state));
    } catch (e) { /* silent */ }
  }

  function loadState() {
    try {
      const stored = localStorage.getItem(STATE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.assign(state, parsed);
      }
    } catch (e) { /* silent */ }
  }

  // ============================================================================
  // FILTER CSS DEFINITIONS (tested & working)
  // ============================================================================

  const filterCSS = {
    monochrome: 'html' + EX + '{filter:grayscale(100%)!important}',
    highcontrast: 'html' + EX + '{filter:contrast(200%)!important}',
    sepia: 'html' + EX + '{filter:sepia(100%)!important}',
    invert: 'html' + EX + '{filter:invert(100%) hue-rotate(180deg)!important}img' + EX + ',video' + EX + '{filter:invert(100%) hue-rotate(180deg)!important}',
    blackyellow: 'html' + EX + '{filter:grayscale(100%) brightness(1.1) sepia(100%) saturate(400%) hue-rotate(0deg) contrast(1.1)!important}'
  };

  // ============================================================================
  // FEATURE FUNCTIONS
  // ============================================================================

  function toggleAnimationStop(enabled) {
    state.animationsStopped = enabled;
    if (enabled) {
      setFeatureCSS('animations',
        '*' + EX + '{animation:none!important;animation-play-state:paused!important;transition:none!important}' +
        'video' + EX + '{animation:none!important;animation-play-state:paused!important}'
      );
      // Also try to pause videos
      document.querySelectorAll('video').forEach(function(v) {
        try { v.pause(); } catch(e) {}
      });
    } else {
      clearFeatureCSS('animations');
    }
    saveState();
  }

  function toggleKeyboardNavigation(enabled) {
    state.keyboardNavigation = enabled;
    if (enabled) {
      setFeatureCSS('keyboard',
        '*' + EX + ':focus{outline:3px solid ' + COLORS.primary + '!important;outline-offset:2px!important}' +
        '*' + EX + ':focus-visible{outline:3px solid ' + COLORS.primary + '!important;outline-offset:2px!important}'
      );
    } else {
      clearFeatureCSS('keyboard');
    }
    saveState();
  }

  function toggleTTS(enabled) {
    state.ttsActive = enabled;
    if (enabled) {
      setFeatureCSS('tts-selection',
        '*' + EX + '{user-select:text!important;-webkit-user-select:text!important}'
      );
      document.addEventListener('mouseup', onTextSelect);
    } else {
      clearFeatureCSS('tts-selection');
      document.removeEventListener('mouseup', onTextSelect);
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    }
    saveState();
  }

  function onTextSelect() {
    if (!state.ttsActive) return;
    var sel = window.getSelection().toString().trim();
    if (sel.length > 0) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
        var utterance = new SpeechSynthesisUtterance(sel);
        // Auto-detect Hebrew vs English
        utterance.lang = /[\u0590-\u05FF]/.test(sel) ? 'he-IL' : 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        try { window.speechSynthesis.speak(utterance); } catch(e) {}
      }
    }
  }

  function activateFilter(filterName) {
    // Turn off all filters first
    var allFilters = ['monochrome', 'highcontrast', 'blackyellow', 'sepia', 'invert'];
    allFilters.forEach(function(f) {
      clearFeatureCSS('filter-' + f);
      state[f + 'Enabled'] = false;
    });

    // If clicking the same filter that was active, just turn it off (toggle)
    if (!filterName) {
      saveState();
      updateAllControls();
      return;
    }

    // Activate the selected filter
    state[filterName + 'Enabled'] = true;
    setFeatureCSS('filter-' + filterName, filterCSS[filterName]);
    saveState();
    updateAllControls();
  }

  function toggleHideImages(enabled) {
    state.hideImagesEnabled = enabled;
    if (enabled) {
      setFeatureCSS('hide-images',
        'img' + EX + ',picture' + EX + ',[role="img"]' + EX + ',svg' + EX + '{opacity:0!important}'
      );
    } else {
      clearFeatureCSS('hide-images');
    }
    saveState();
  }

  function toggleHighlightLinks(enabled) {
    state.highlightLinksEnabled = enabled;
    if (enabled) {
      setFeatureCSS('highlight-links',
        'a' + EX + '{outline:2px solid ' + COLORS.primary + '!important;outline-offset:1px!important;background-color:rgba(21,101,192,0.1)!important}'
      );
    } else {
      clearFeatureCSS('highlight-links');
    }
    saveState();
  }

  function toggleHighlightHeadings(enabled) {
    state.highlightHeadingsEnabled = enabled;
    if (enabled) {
      setFeatureCSS('highlight-headings',
        'h1' + EX + ',h2' + EX + ',h3' + EX + ',h4' + EX + ',h5' + EX + ',h6' + EX +
        '{outline:2px solid ' + COLORS.primary + '!important;outline-offset:2px!important;background-color:rgba(21,101,192,0.1)!important}'
      );
    } else {
      clearFeatureCSS('highlight-headings');
    }
    saveState();
  }

  function toggleReadableFont(enabled) {
    state.readableFontEnabled = enabled;
    if (enabled) {
      setFeatureCSS('readable-font',
        '*' + EX + '{font-family:Arial,Helvetica,sans-serif!important}'
      );
    } else {
      clearFeatureCSS('readable-font');
    }
    saveState();
  }

  function toggleReadingGuide(enabled) {
    state.readingGuideEnabled = enabled;
    if (enabled) {
      var guide = document.getElementById('sa11y-reading-guide');
      if (!guide) {
        guide = document.createElement('div');
        guide.id = 'sa11y-reading-guide';
        guide.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:8px;background:rgba(21,101,192,0.3);pointer-events:none;z-index:999999;display:block;border-top:2px solid ' + COLORS.primary + ';border-bottom:2px solid ' + COLORS.primary;
        var root = document.getElementById(WIDGET_ROOT_ID);
        if (root) root.appendChild(guide);
      }
      guide.style.display = 'block';
      document.addEventListener('mousemove', moveReadingGuide);
    } else {
      var guide = document.getElementById('sa11y-reading-guide');
      if (guide) guide.style.display = 'none';
      document.removeEventListener('mousemove', moveReadingGuide);
    }
    saveState();
  }

  function moveReadingGuide(e) {
    var guide = document.getElementById('sa11y-reading-guide');
    if (guide) guide.style.top = (e.clientY - 4) + 'px';
  }

  function toggleAltText(enabled) {
    state.altTextEnabled = enabled;
    if (enabled) {
      showAltBadges();
    } else {
      clearAltBadges();
    }
    saveState();
  }

  function showAltBadges() {
    clearAltBadges();
    var root = document.getElementById(WIDGET_ROOT_ID);
    if (!root) return;
    document.querySelectorAll('img[alt]').forEach(function(img) {
      var alt = img.getAttribute('alt');
      if (!alt || !alt.trim()) return;
      var badge = document.createElement('div');
      badge.className = 'sa11y-alt-badge';
      badge.textContent = 'ALT: ' + alt;
      badge.style.cssText = 'position:absolute;background:' + COLORS.primary + ';color:#fff;padding:2px 6px;border-radius:3px;font-size:10px;z-index:999997;max-width:200px;word-wrap:break-word;pointer-events:none;';
      root.appendChild(badge);
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

  function setFontSize(percent) {
    state.fontSizePercent = percent;
    if (percent !== 100) {
      var zoom = (percent / 100).toFixed(2);
      setFeatureCSS('fontsize',
        'body>*:not(#sa11y-widget-root){zoom:' + zoom + '!important}'
      );
    } else {
      clearFeatureCSS('fontsize');
    }
    var val = document.getElementById('sa11y-fontsize-value');
    if (val) val.textContent = percent + '%';
    saveState();
  }

  function setLineHeight(percent) {
    state.lineHeightPercent = percent;
    if (percent !== 100) {
      var lh = (percent / 100 * 1.5).toFixed(2);
      setFeatureCSS('lineheight',
        '*' + EX + '{line-height:' + lh + '!important}'
      );
    } else {
      clearFeatureCSS('lineheight');
    }
    var val = document.getElementById('sa11y-lineheight-value');
    if (val) val.textContent = percent + '%';
    saveState();
  }

  function setLetterSpacing(px) {
    state.letterSpacingPx = px;
    if (px > 0) {
      setFeatureCSS('letterspacing',
        '*' + EX + '{letter-spacing:' + px + 'px!important}'
      );
    } else {
      clearFeatureCSS('letterspacing');
    }
    var val = document.getElementById('sa11y-letterspacing-value');
    if (val) val.textContent = px + 'px';
    saveState();
  }

  function setWordSpacing(px) {
    state.wordSpacingPx = px;
    if (px > 0) {
      setFeatureCSS('wordspacing',
        '*' + EX + '{word-spacing:' + px + 'px!important}'
      );
    } else {
      clearFeatureCSS('wordspacing');
    }
    var val = document.getElementById('sa11y-wordspacing-value');
    if (val) val.textContent = px + 'px';
    saveState();
  }

  function setCursorType(type) {
    clearFeatureCSS('cursor');
    if (state.cursorType === type) {
      state.cursorType = null;
    } else {
      state.cursorType = type;
      if (type === 'large-black') {
        setFeatureCSS('cursor',
          '*' + EX + '{cursor:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><polygon points="4,4 4,36 14,26 24,42 30,38 20,22 34,22" fill="black" stroke="black" stroke-width="2"/></svg>\') 4 4,auto!important}'
        );
      } else if (type === 'large-white') {
        setFeatureCSS('cursor',
          '*' + EX + '{cursor:url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><polygon points="4,4 4,36 14,26 24,42 30,38 20,22 34,22" fill="white" stroke="black" stroke-width="2"/></svg>\') 4 4,auto!important}'
        );
      }
    }
    saveState();
    updateAllControls();
  }

  function resetAll() {
    // Clear all feature styles
    Object.keys(featureStyles).forEach(function(name) {
      featureStyles[name].textContent = '';
    });

    // Remove reading guide
    var guide = document.getElementById('sa11y-reading-guide');
    if (guide) guide.style.display = 'none';
    document.removeEventListener('mousemove', moveReadingGuide);

    // Clear alt badges
    clearAltBadges();

    // Stop TTS
    document.removeEventListener('mouseup', onTextSelect);
    if (window.speechSynthesis) window.speechSynthesis.cancel();

    // Reset state
    state.animationsStopped = false;
    state.keyboardNavigation = false;
    state.ttsActive = false;
    state.monochromeEnabled = false;
    state.highContrastEnabled = false;
    state.blackYellowEnabled = false;
    state.sepiaEnabled = false;
    state.invertEnabled = false;
    state.hideImagesEnabled = false;
    state.highlightLinksEnabled = false;
    state.highlightHeadingsEnabled = false;
    state.readableFontEnabled = false;
    state.readingGuideEnabled = false;
    state.altTextEnabled = false;
    state.fontSizePercent = 100;
    state.lineHeightPercent = 100;
    state.letterSpacingPx = 0;
    state.wordSpacingPx = 0;
    state.cursorType = null;

    saveState();
    updateAllControls();

    // Reset slider displays
    var fv = document.getElementById('sa11y-fontsize-value');
    if (fv) fv.textContent = '100%';
    var lv = document.getElementById('sa11y-lineheight-value');
    if (lv) lv.textContent = '100%';
    var lsv = document.getElementById('sa11y-letterspacing-value');
    if (lsv) lsv.textContent = '0px';
    var wsv = document.getElementById('sa11y-wordspacing-value');
    if (wsv) wsv.textContent = '0px';
  }

  // ============================================================================
  // UI UPDATE
  // ============================================================================

  function updateAllControls() {
    var toggles = {
      'sa11y-anim-btn': state.animationsStopped,
      'sa11y-key-btn': state.keyboardNavigation,
      'sa11y-tts-btn': state.ttsActive,
      'sa11y-filter-monochrome-btn': state.monochromeEnabled,
      'sa11y-filter-highcontrast-btn': state.highContrastEnabled,
      'sa11y-filter-blackyellow-btn': state.blackYellowEnabled,
      'sa11y-filter-sepia-btn': state.sepiaEnabled,
      'sa11y-filter-invert-btn': state.invertEnabled,
      'sa11y-hide-images-btn': state.hideImagesEnabled,
      'sa11y-highlight-links-btn': state.highlightLinksEnabled,
      'sa11y-highlight-headings-btn': state.highlightHeadingsEnabled,
      'sa11y-readable-font-btn': state.readableFontEnabled,
      'sa11y-reading-guide-btn': state.readingGuideEnabled,
      'sa11y-alt-text-btn': state.altTextEnabled,
      'sa11y-cursor-black-btn': state.cursorType === 'large-black',
      'sa11y-cursor-white-btn': state.cursorType === 'large-white'
    };

    Object.keys(toggles).forEach(function(id) {
      var btn = document.getElementById(id);
      if (btn) {
        if (toggles[id]) {
          btn.classList.add('active');
          btn.setAttribute('aria-pressed', 'true');
        } else {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        }
      }
    });

    // Sliders
    var fs = document.getElementById('sa11y-fontsize-slider');
    if (fs) fs.value = state.fontSizePercent;
    var ls = document.getElementById('sa11y-lineheight-slider');
    if (ls) ls.value = state.lineHeightPercent;
    var lts = document.getElementById('sa11y-letterspacing-slider');
    if (lts) lts.value = state.letterSpacingPx;
    var ws = document.getElementById('sa11y-wordspacing-slider');
    if (ws) ws.value = state.wordSpacingPx;
  }

  // ============================================================================
  // ACCESSIBILITY STATEMENT DATA
  // ============================================================================

  var statements = {
    he: {
      title: '\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA',
      lastUpdate: '\u05E2\u05D3\u05DB\u05D5\u05DF \u05D0\u05D7\u05E8\u05D5\u05DF: \u05DE\u05E8\u05E5 2026',
      commitment: {
        title: '\u05D4\u05DE\u05D7\u05D5\u05D9\u05D1\u05D5\u05EA \u05E9\u05DC\u05E0\u05D5',
        text: 'SHAKED ALON DESIGN \u05DE\u05D7\u05D5\u05D9\u05D1\u05EA \u05DC\u05D4\u05D1\u05D8\u05D7\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9\u05EA \u05DC\u05DE\u05E9\u05EA\u05DE\u05E9\u05D9\u05DD \u05E2\u05DD \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05D9\u05D5\u05EA \u05E9\u05D5\u05E0\u05D5\u05EA. \u05D0\u05E0\u05D5 \u05E2\u05D5\u05D1\u05D3\u05D9\u05DD \u05D1\u05D4\u05EA\u05D0\u05DE\u05D4 \u05DC\u05EA\u05E7\u05DF \u05EA"\u05D9 5568 \u05D5\u05D7\u05D5\u05E7 \u05E9\u05D5\u05D5\u05D9\u05D5\u05DF \u05D6\u05DB\u05D5\u05D9\u05D5\u05EA \u05DC\u05D0\u05E0\u05E9\u05D9\u05DD \u05E2\u05DD \u05DE\u05D5\u05D2\u05D1\u05DC\u05D5\u05EA, \u05D4\u05EA\u05E9\u05E0"\u05D7-1998 (\u05EA\u05D9\u05E7\u05D5\u05DF \u05DE\u05E1\' 18).'
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
        text: '\u05D0\u05E0\u05D5 \u05DE\u05D5\u05D3\u05E2\u05D9\u05DD \u05DC\u05E7\u05D9\u05D5\u05DE\u05DF \u05E9\u05DC \u05D4\u05DE\u05D2\u05D1\u05DC\u05D5\u05EA \u05D4\u05D1\u05D0\u05D5\u05EA: \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA \u05DE\u05E1\u05D5\u05D9\u05DE\u05D5\u05EA \u05DC\u05DC\u05D0 \u05EA\u05D9\u05D0\u05D5\u05E8 \u05D7\u05DC\u05D5\u05E4\u05D9 \u05DE\u05E4\u05D5\u05E8\u05E9, \u05EA\u05D5\u05DB\u05DF \u05DE\u05E9\u05DC\u05D9\u05E9\u05D9 \u05E2\u05E9\u05D5\u05D9 \u05E9\u05DC\u05D0 \u05DC\u05D4\u05D9\u05D5\u05EA \u05E0\u05D2\u05D9\u05E9 \u05D1\u05DE\u05DC\u05D5\u05D0\u05D5, \u05E7\u05D1\u05E6\u05D9 PDF \u05DE\u05E1\u05D5\u05D9\u05DE\u05D9\u05DD \u05E2\u05E9\u05D5\u05D9\u05D9\u05DD \u05E9\u05DC\u05D0 \u05DC\u05D4\u05D9\u05D5\u05EA \u05DE\u05D5\u05D2\u05E0\u05D9\u05DD \u05D3\u05D9\u05D2\u05D9\u05D8\u05DC\u05D9\u05EA.'
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

  // ============================================================================
  // STATEMENT RENDERING
  // ============================================================================

  function renderStatement(lang) {
    var s = statements[lang];
    var isRTL = lang === 'he';
    var emailLabel = isRTL ? '\u05D3\u05D5\u05D0"\u05DC' : 'Email';
    var phoneLabel = isRTL ? '\u05D8\u05DC\u05E4\u05D5\u05DF' : 'Phone';
    var siteLabel = isRTL ? '\u05D0\u05EA\u05E8' : 'Website';
    var closeLabel = isRTL ? '\u05E1\u05D2\u05D5\u05E8' : 'Close';

    var html = '<div class="sa11y-statement-header">' +
      '<button id="sa11y-close-statement" class="sa11y-close-btn" aria-label="' + closeLabel + '">\u00D7</button>' +
      '<div class="sa11y-statement-lang-toggle">' +
        '<button class="sa11y-lang-btn ' + (lang === 'he' ? 'active' : '') + '" data-lang="he">\u05E2\u05D1\u05E8\u05D9\u05EA</button>' +
        '<button class="sa11y-lang-btn ' + (lang === 'en' ? 'active' : '') + '" data-lang="en">English</button>' +
      '</div></div>' +
      '<div class="sa11y-statement-content" dir="' + (isRTL ? 'rtl' : 'ltr') + '">' +
        '<h1>' + s.title + '</h1>' +
        '<p class="sa11y-date">' + s.lastUpdate + '</p>' +
        '<section><h2>' + s.commitment.title + '</h2><p>' + s.commitment.text + '</p></section>' +
        '<section><h2>' + s.accessibility.title + '</h2><p>' + s.accessibility.text + '</p></section>' +
        '<section><h2>' + s.features.title + '</h2>' +
          '<div class="sa11y-feature-columns"><div><h3>' + s.features.widgetTitle + '</h3><ul>';

    s.features.widget.forEach(function(f) { html += '<li>' + f + '</li>'; });

    html += '</ul></div><div><h3>' + s.features.siteTitle + '</h3><ul>';

    s.features.site.forEach(function(f) { html += '<li>' + f + '</li>'; });

    html += '</ul></div></div></section>' +
      '<section><h2>' + s.limitations.title + '</h2><p>' + s.limitations.text + '</p></section>' +
      '<section><h2>' + s.contact.title + '</h2><p>' + s.contact.text + '</p>' +
        '<p><strong>' + s.contact.name + '</strong><br>' +
        emailLabel + ': <a href="mailto:' + s.contact.email + '">' + s.contact.email + '</a><br>' +
        phoneLabel + ': <a href="tel:' + s.contact.phone.replace(/-/g, '') + '">' + s.contact.phone + '</a><br>' +
        siteLabel + ': <a href="https://' + s.contact.website + '" target="_blank">' + s.contact.website + '</a></p></section>' +
      '<section><h2>' + s.legal.title + '</h2><ul>';

    s.legal.items.forEach(function(item) { html += '<li>' + item + '</li>'; });

    html += '</ul></section></div>';

    return html;
  }

  // ============================================================================
  // DOM CREATION — ALL HEBREW UI
  // ============================================================================

  function createWidget() {
    if (document.getElementById(WIDGET_ROOT_ID)) return;

    var root = document.createElement('div');
    root.id = WIDGET_ROOT_ID;
    document.body.appendChild(root);

    // Widget styles — root does NOT block page interaction
    var style = document.createElement('style');
    style.id = 'sa11y-widget-styles';
    style.textContent = '#' + WIDGET_ROOT_ID + '{' +
      'position:fixed;bottom:0;left:0;z-index:999999;font-family:Arial,sans-serif;direction:rtl;pointer-events:none;' +
    '}' +
    '#' + WIDGET_ROOT_ID + ' *{pointer-events:auto;}' +

    // Trigger button
    '#sa11y-trigger{' +
      'position:fixed;bottom:20px;left:20px;width:50px;height:50px;border-radius:50%;' +
      'background:' + COLORS.primary + ';color:#fff;border:none;cursor:pointer;display:flex;' +
      'align-items:center;justify-content:center;font-size:24px;z-index:999999;' +
      'box-shadow:0 2px 8px rgba(0,0,0,0.25);transition:all .3s ease;pointer-events:auto;' +
    '}' +
    '#sa11y-trigger:hover{background:#0d47a1;transform:scale(1.1);}' +
    '#sa11y-trigger:focus{outline:2px solid ' + COLORS.primary + ';outline-offset:2px;}' +

    // Panel
    '#sa11y-panel{' +
      'position:fixed;bottom:80px;left:20px;width:220px;max-height:calc(100vh - 100px);' +
      'background:#fff;border-radius:8px;box-shadow:0 4px 16px rgba(0,0,0,0.15);' +
      'display:flex;flex-direction:column;z-index:999999;border:1px solid #e0e0e0;' +
      'transform:translateY(20px);opacity:0;pointer-events:none;transition:all .3s ease;' +
      'direction:rtl;' +
    '}' +
    '#sa11y-panel.open{transform:translateY(0);opacity:1;pointer-events:auto;}' +

    // Header
    '.sa11y-header{padding:12px;border-bottom:1px solid #e0e0e0;font-weight:bold;color:' + COLORS.primary + ';flex-shrink:0;text-align:center;font-size:14px;}' +

    // Scrollable area
    '.sa11y-panel-scroll{flex:1;overflow-y:auto;padding:10px 12px;}' +

    // Sections
    '.sa11y-section{margin-bottom:14px;}' +
    '.sa11y-section-title{font-weight:bold;color:' + COLORS.primary + ';margin-bottom:6px;font-size:11px;letter-spacing:0.3px;}' +

    // Buttons
    '.sa11y-button-group{display:flex;flex-direction:column;gap:5px;}' +
    '.sa11y-button-row{display:flex;gap:5px;}' +
    '.sa11y-button-row .sa11y-btn{flex:1;}' +
    '.sa11y-btn{' +
      'background:#f5f5f5;color:' + COLORS.dark + ';border:1px solid #ddd;padding:7px 10px;' +
      'border-radius:4px;cursor:pointer;font-size:11px;transition:all .2s ease;text-align:center;' +
      'font-weight:500;min-height:34px;display:flex;align-items:center;justify-content:center;' +
      'font-family:Arial,sans-serif;' +
    '}' +
    '.sa11y-btn:hover{background:#efefef;border-color:#bbb;}' +
    '.sa11y-btn:focus{outline:2px solid ' + COLORS.primary + ';outline-offset:-2px;}' +
    '.sa11y-btn.active{background:' + COLORS.primary + ';color:#fff;border-color:' + COLORS.primary + ';}' +

    // Sliders
    '.sa11y-slider-group{margin-bottom:10px;}' +
    '.sa11y-slider-label{display:flex;justify-content:space-between;font-size:11px;color:' + COLORS.lightGray + ';margin-bottom:3px;font-family:Arial,sans-serif;}' +
    '.sa11y-slider{width:100%;height:6px;border-radius:3px;background:#ddd;outline:none;-webkit-appearance:none;appearance:none;}' +
    '.sa11y-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:16px;height:16px;border-radius:50%;background:' + COLORS.primary + ';cursor:pointer;}' +
    '.sa11y-slider::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:' + COLORS.primary + ';cursor:pointer;border:none;}' +

    // Footer
    '.sa11y-footer{padding:10px 12px;border-top:1px solid #e0e0e0;display:flex;gap:5px;flex-shrink:0;}' +
    '.sa11y-footer .sa11y-btn{flex:1;}' +

    // Statement overlay
    '#sa11y-statement-overlay{' +
      'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);' +
      'display:none;align-items:center;justify-content:center;z-index:1000001;pointer-events:auto;' +
    '}' +
    '#sa11y-statement-overlay.open{display:flex;}' +
    '#sa11y-statement-modal{' +
      'background:#fff;color:' + COLORS.dark + ';width:90%;max-width:700px;max-height:85vh;overflow-y:auto;' +
      'border-radius:8px;box-shadow:0 8px 32px rgba(0,0,0,0.2);' +
    '}' +
    '.sa11y-statement-header{padding:16px 20px;border-bottom:1px solid #e0e0e0;display:flex;justify-content:space-between;align-items:center;}' +
    '.sa11y-statement-lang-toggle{display:flex;gap:8px;}' +
    '.sa11y-lang-btn{background:#f5f5f5;color:' + COLORS.dark + ';border:1px solid #ddd;padding:6px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500;}' +
    '.sa11y-lang-btn.active{background:' + COLORS.primary + ';color:#fff;border-color:' + COLORS.primary + ';}' +
    '.sa11y-close-btn{background:none;border:none;font-size:28px;cursor:pointer;color:' + COLORS.dark + ';width:36px;height:36px;display:flex;align-items:center;justify-content:center;}' +
    '.sa11y-statement-content{padding:20px;}' +
    '.sa11y-statement-content h1{color:' + COLORS.primary + ';margin-bottom:8px;font-size:22px;}' +
    '.sa11y-statement-content h2{color:' + COLORS.primary + ';margin-top:20px;margin-bottom:12px;font-size:16px;}' +
    '.sa11y-statement-content h3{color:' + COLORS.primary + ';margin-top:12px;margin-bottom:8px;font-size:14px;}' +
    '.sa11y-statement-content p{line-height:1.6;margin-bottom:12px;color:' + COLORS.dark + ';}' +
    '.sa11y-date{color:' + COLORS.mediumGray + ';font-size:12px;margin-bottom:20px;}' +
    '.sa11y-statement-content ul{margin-right:20px;margin-bottom:12px;}' +
    '.sa11y-statement-content li{margin-bottom:6px;color:' + COLORS.dark + ';line-height:1.5;}' +
    '.sa11y-statement-content a{color:' + COLORS.primary + ';text-decoration:none;}' +
    '.sa11y-statement-content a:hover{text-decoration:underline;}' +
    '.sa11y-feature-columns{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:12px;}' +

    // Mobile
    '@media(max-width:600px){' +
      '#sa11y-trigger{width:44px;height:44px;bottom:16px;left:16px;}' +
      '#sa11y-panel{bottom:0;left:0;right:0;width:100%;max-height:80vh;border-radius:12px 12px 0 0;transform:translateY(100%);}' +
      '#sa11y-panel.open{transform:translateY(0);}' +
      '.sa11y-feature-columns{grid-template-columns:1fr;}' +
      '#sa11y-statement-modal{width:95%;max-height:90vh;}' +
    '}';

    root.appendChild(style);

    // Trigger button
    var trigger = document.createElement('button');
    trigger.id = 'sa11y-trigger';
    trigger.innerHTML = '\u267F';
    trigger.setAttribute('aria-label', '\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.setAttribute('title', '\u05EA\u05E4\u05E8\u05D9\u05D8 \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA');
    root.appendChild(trigger);

    // Panel — ALL HEBREW
    var panel = document.createElement('div');
    panel.id = 'sa11y-panel';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-label', '\u05D0\u05E4\u05E9\u05E8\u05D5\u05D9\u05D5\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA');
    panel.innerHTML =
      '<div class="sa11y-header">\u05E0\u05D2\u05D9\u05E9\u05D5\u05EA</div>' +
      '<div class="sa11y-panel-scroll">' +

      // Navigation section
      '<div class="sa11y-section">' +
        '<div class="sa11y-section-title">\u05E0\u05D9\u05D5\u05D5\u05D8</div>' +
        '<div class="sa11y-button-group">' +
          '<button id="sa11y-anim-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E2\u05E6\u05D5\u05E8 \u05D0\u05E0\u05D9\u05DE\u05E6\u05D9\u05D5\u05EA">\u05E2\u05E6\u05D5\u05E8 \u05D0\u05E0\u05D9\u05DE\u05E6\u05D9\u05D5\u05EA</button>' +
          '<button id="sa11y-key-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05DE\u05E1\u05D2\u05E8\u05D5\u05EA \u05DE\u05D9\u05E7\u05D5\u05D3">\u05DE\u05E1\u05D2\u05E8\u05D5\u05EA \u05DE\u05D9\u05E7\u05D5\u05D3</button>' +
          '<button id="sa11y-tts-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E7\u05E8\u05D9\u05D0\u05D4 \u05D1\u05E7\u05D5\u05DC">\u05E7\u05E8\u05D9\u05D0\u05D4 \u05D1\u05E7\u05D5\u05DC</button>' +
        '</div>' +
      '</div>' +

      // Display filters
      '<div class="sa11y-section">' +
        '<div class="sa11y-section-title">\u05DE\u05E1\u05E0\u05E0\u05D9 \u05EA\u05E6\u05D5\u05D2\u05D4</div>' +
        '<div class="sa11y-button-group">' +
          '<div class="sa11y-button-row">' +
            '<button id="sa11y-filter-monochrome-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E9\u05D7\u05D5\u05E8-\u05DC\u05D1\u05DF">\u05E9\u05D7\u05D5\u05E8-\u05DC\u05D1\u05DF</button>' +
            '<button id="sa11y-filter-highcontrast-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA">\u05E0\u05D9\u05D2\u05D5\u05D3\u05D9\u05D5\u05EA</button>' +
          '</div>' +
          '<div class="sa11y-button-row">' +
            '<button id="sa11y-filter-blackyellow-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E9\u05D7\u05D5\u05E8-\u05E6\u05D4\u05D5\u05D1">\u05E9\u05D7\u05D5\u05E8-\u05E6\u05D4\u05D5\u05D1</button>' +
            '<button id="sa11y-filter-sepia-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E1\u05E4\u05D9\u05D4">\u05E1\u05E4\u05D9\u05D4</button>' +
          '</div>' +
          '<div class="sa11y-button-row">' +
            '<button id="sa11y-filter-invert-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05D4\u05D9\u05E4\u05D5\u05DA \u05E6\u05D1\u05E2\u05D9\u05DD">\u05D4\u05D9\u05E4\u05D5\u05DA \u05E6\u05D1\u05E2\u05D9\u05DD</button>' +
            '<button id="sa11y-hide-images-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05D4\u05E1\u05EA\u05E8 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA">\u05D4\u05E1\u05EA\u05E8 \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      // Content section
      '<div class="sa11y-section">' +
        '<div class="sa11y-section-title">\u05EA\u05D5\u05DB\u05DF</div>' +
        '<div class="sa11y-button-group">' +
          '<button id="sa11y-highlight-links-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05D4\u05D3\u05D2\u05E9 \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD">\u05D4\u05D3\u05D2\u05E9 \u05E7\u05D9\u05E9\u05D5\u05E8\u05D9\u05DD</button>' +
          '<button id="sa11y-highlight-headings-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05D4\u05D3\u05D2\u05E9 \u05DB\u05D5\u05EA\u05E8\u05D5\u05EA">\u05D4\u05D3\u05D2\u05E9 \u05DB\u05D5\u05EA\u05E8\u05D5\u05EA</button>' +
          '<button id="sa11y-readable-font-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05D2\u05D5\u05E4\u05DF \u05E7\u05E8\u05D9\u05D0">\u05D2\u05D5\u05E4\u05DF \u05E7\u05E8\u05D9\u05D0</button>' +
          '<button id="sa11y-reading-guide-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05DE\u05D3\u05E8\u05D9\u05DA \u05E7\u05E8\u05D9\u05D0\u05D4">\u05DE\u05D3\u05E8\u05D9\u05DA \u05E7\u05E8\u05D9\u05D0\u05D4</button>' +
          '<button id="sa11y-alt-text-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05D4\u05E6\u05D2 \u05D8\u05E7\u05E1\u05D8 \u05D7\u05DC\u05D5\u05E4\u05D9">\u05D8\u05E7\u05E1\u05D8 \u05D7\u05DC\u05D5\u05E4\u05D9</button>' +
        '</div>' +
      '</div>' +

      // Font size slider
      '<div class="sa11y-section">' +
        '<div class="sa11y-slider-group">' +
          '<div class="sa11y-slider-label"><span>\u05D2\u05D5\u05D3\u05DC \u05D2\u05D5\u05E4\u05DF</span><span id="sa11y-fontsize-value">100%</span></div>' +
          '<input type="range" id="sa11y-fontsize-slider" class="sa11y-slider" min="80" max="200" value="100" step="10">' +
        '</div>' +
      '</div>' +

      // Line height slider
      '<div class="sa11y-section">' +
        '<div class="sa11y-slider-group">' +
          '<div class="sa11y-slider-label"><span>\u05D2\u05D5\u05D1\u05D4 \u05E9\u05D5\u05E8\u05D4</span><span id="sa11y-lineheight-value">100%</span></div>' +
          '<input type="range" id="sa11y-lineheight-slider" class="sa11y-slider" min="100" max="300" value="100" step="25">' +
        '</div>' +
      '</div>' +

      // Letter spacing slider
      '<div class="sa11y-section">' +
        '<div class="sa11y-slider-group">' +
          '<div class="sa11y-slider-label"><span>\u05DE\u05E8\u05D5\u05D5\u05D7 \u05D0\u05D5\u05EA\u05D9\u05D5\u05EA</span><span id="sa11y-letterspacing-value">0px</span></div>' +
          '<input type="range" id="sa11y-letterspacing-slider" class="sa11y-slider" min="0" max="10" value="0" step="1">' +
        '</div>' +
      '</div>' +

      // Word spacing slider
      '<div class="sa11y-section">' +
        '<div class="sa11y-slider-group">' +
          '<div class="sa11y-slider-label"><span>\u05DE\u05E8\u05D5\u05D5\u05D7 \u05DE\u05D9\u05DC\u05D9\u05DD</span><span id="sa11y-wordspacing-value">0px</span></div>' +
          '<input type="range" id="sa11y-wordspacing-slider" class="sa11y-slider" min="0" max="10" value="0" step="1">' +
        '</div>' +
      '</div>' +

      // Cursor section
      '<div class="sa11y-section">' +
        '<div class="sa11y-section-title">\u05E1\u05DE\u05DF</div>' +
        '<div class="sa11y-button-group">' +
          '<div class="sa11y-button-row">' +
            '<button id="sa11y-cursor-black-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC \u05E9\u05D7\u05D5\u05E8">\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC \u25CF</button>' +
            '<button id="sa11y-cursor-white-btn" class="sa11y-btn" role="switch" aria-pressed="false" title="\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC \u05DC\u05D1\u05DF">\u05E1\u05DE\u05DF \u05D2\u05D3\u05D5\u05DC \u25CB</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '</div>' + // end scroll

      // Footer
      '<div class="sa11y-footer">' +
        '<button id="sa11y-reset-btn" class="sa11y-btn" title="\u05D0\u05D9\u05E4\u05D5\u05E1">\u05D0\u05D9\u05E4\u05D5\u05E1</button>' +
        '<button id="sa11y-statement-btn" class="sa11y-btn" title="\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA">\u05D4\u05E6\u05D4\u05E8\u05EA \u05E0\u05D2\u05D9\u05E9\u05D5\u05EA</button>' +
      '</div>';

    root.appendChild(panel);

    // Statement overlay
    var overlay = document.createElement('div');
    overlay.id = 'sa11y-statement-overlay';
    overlay.innerHTML = '<div id="sa11y-statement-modal"></div>';
    root.appendChild(overlay);

    // ========== EVENT LISTENERS ==========

    // Toggle panel
    trigger.addEventListener('click', function() {
      state.panelOpen = !state.panelOpen;
      if (state.panelOpen) {
        panel.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        panel.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Reset
    document.getElementById('sa11y-reset-btn').addEventListener('click', resetAll);

    // Statement button
    document.getElementById('sa11y-statement-btn').addEventListener('click', function() {
      var lang = state.statementLang || 'he';
      var modal = document.getElementById('sa11y-statement-modal');
      modal.innerHTML = renderStatement(lang);
      overlay.classList.add('open');
      attachStatementListeners();
    });

    function attachStatementListeners() {
      var langBtns = document.querySelectorAll('#sa11y-statement-modal .sa11y-lang-btn');
      langBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var newLang = btn.getAttribute('data-lang');
          state.statementLang = newLang;
          var modal = document.getElementById('sa11y-statement-modal');
          modal.innerHTML = renderStatement(newLang);
          attachStatementListeners();
        });
      });
      var closeBtn = document.getElementById('sa11y-close-statement');
      if (closeBtn) {
        closeBtn.addEventListener('click', function() {
          overlay.classList.remove('open');
        });
      }
    }

    // Close overlay on background click
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.classList.remove('open');
    });

    // Navigation buttons
    document.getElementById('sa11y-anim-btn').addEventListener('click', function() {
      toggleAnimationStop(!state.animationsStopped);
      updateAllControls();
    });

    document.getElementById('sa11y-key-btn').addEventListener('click', function() {
      toggleKeyboardNavigation(!state.keyboardNavigation);
      updateAllControls();
    });

    document.getElementById('sa11y-tts-btn').addEventListener('click', function() {
      toggleTTS(!state.ttsActive);
      updateAllControls();
    });

    // Filter buttons — each one toggles itself and turns off others
    var filterButtons = {
      'sa11y-filter-monochrome-btn': 'monochrome',
      'sa11y-filter-highcontrast-btn': 'highcontrast',
      'sa11y-filter-blackyellow-btn': 'blackyellow',
      'sa11y-filter-sepia-btn': 'sepia',
      'sa11y-filter-invert-btn': 'invert'
    };

    Object.keys(filterButtons).forEach(function(btnId) {
      var filterName = filterButtons[btnId];
      document.getElementById(btnId).addEventListener('click', function() {
        var wasActive = state[filterName + 'Enabled'];
        activateFilter(wasActive ? null : filterName);
      });
    });

    // Hide images
    document.getElementById('sa11y-hide-images-btn').addEventListener('click', function() {
      toggleHideImages(!state.hideImagesEnabled);
      updateAllControls();
    });

    // Content buttons
    document.getElementById('sa11y-highlight-links-btn').addEventListener('click', function() {
      toggleHighlightLinks(!state.highlightLinksEnabled);
      updateAllControls();
    });

    document.getElementById('sa11y-highlight-headings-btn').addEventListener('click', function() {
      toggleHighlightHeadings(!state.highlightHeadingsEnabled);
      updateAllControls();
    });

    document.getElementById('sa11y-readable-font-btn').addEventListener('click', function() {
      toggleReadableFont(!state.readableFontEnabled);
      updateAllControls();
    });

    document.getElementById('sa11y-reading-guide-btn').addEventListener('click', function() {
      toggleReadingGuide(!state.readingGuideEnabled);
      updateAllControls();
    });

    document.getElementById('sa11y-alt-text-btn').addEventListener('click', function() {
      toggleAltText(!state.altTextEnabled);
      updateAllControls();
    });

    // Sliders
    document.getElementById('sa11y-fontsize-slider').addEventListener('input', function() {
      setFontSize(parseInt(this.value));
    });

    document.getElementById('sa11y-lineheight-slider').addEventListener('input', function() {
      setLineHeight(parseInt(this.value));
    });

    document.getElementById('sa11y-letterspacing-slider').addEventListener('input', function() {
      setLetterSpacing(parseInt(this.value));
    });

    document.getElementById('sa11y-wordspacing-slider').addEventListener('input', function() {
      setWordSpacing(parseInt(this.value));
    });

    // Cursor buttons
    document.getElementById('sa11y-cursor-black-btn').addEventListener('click', function() {
      setCursorType('large-black');
    });

    document.getElementById('sa11y-cursor-white-btn').addEventListener('click', function() {
      setCursorType('large-white');
    });

    // Close panel on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (overlay.classList.contains('open')) {
          overlay.classList.remove('open');
        } else if (state.panelOpen) {
          state.panelOpen = false;
          panel.classList.remove('open');
          trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });

    // ========== RESTORE SAVED STATE ==========
    loadState();
    applyRestoredState();
    updateAllControls();
  }

  function applyRestoredState() {
    if (state.animationsStopped) toggleAnimationStop(true);
    if (state.keyboardNavigation) toggleKeyboardNavigation(true);
    if (state.ttsActive) toggleTTS(true);
    if (state.monochromeEnabled) activateFilter('monochrome');
    else if (state.highContrastEnabled) activateFilter('highcontrast');
    else if (state.blackYellowEnabled) activateFilter('blackyellow');
    else if (state.sepiaEnabled) activateFilter('sepia');
    else if (state.invertEnabled) activateFilter('invert');
    if (state.hideImagesEnabled) toggleHideImages(true);
    if (state.highlightLinksEnabled) toggleHighlightLinks(true);
    if (state.highlightHeadingsEnabled) toggleHighlightHeadings(true);
    if (state.readableFontEnabled) toggleReadableFont(true);
    if (state.readingGuideEnabled) toggleReadingGuide(true);
    if (state.altTextEnabled) toggleAltText(true);
    if (state.fontSizePercent !== 100) setFontSize(state.fontSizePercent);
    if (state.lineHeightPercent !== 100) setLineHeight(state.lineHeightPercent);
    if (state.letterSpacingPx > 0) setLetterSpacing(state.letterSpacingPx);
    if (state.wordSpacingPx > 0) setWordSpacing(state.wordSpacingPx);
    if (state.cursorType) setCursorType(state.cursorType);
  }

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWidget);
  } else {
    createWidget();
  }

})();
