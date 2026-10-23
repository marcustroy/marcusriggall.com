# Multilingual Performance Reviews
*Reducing customer churn through research-driven translation workflows*

## Overview
When multilingual performance reviews became the #3 reason for customer churn, I led the design of Culture Amp's first comprehensive translation management system. Through user research and iterative design, I created an intuitive workflow that retained a $1M+ ARR customer and enabled 4,000+ multilingual reviews with minimal support overhead.

**My Role:** Lead Product Designer  
**Timeline:** 2 months - Q4 2024
**Team:** Product Manager, 2 Engineers

## The Challenge
Multilingual performance reviews ranked as the #3 reason for customer churn and limited EMEA market growth. As Lead Product Designer, I needed to create a solution that went beyond basic translation management.

![Business impact visualization - Replace with metrics visual]

## Getting deeper into the problem
To get started, I wanted to learn more about how our customers were running Performance Cycles in multiple languages. I conducted 10 interviews with customers to learn more about how they run their process. In addition to learning more about the process, I took a first cut prototype of what I assumed the process could look like to get customer feedback.

![Research findings visualization - Replace with actual artifact]

### What I learnt

1. Machine translations are deeply embedded into the process

> "We run everything through Google Translate, then had HRBPs validate the translations." — HR Director, global manufacturing company

I initially thought machine translations might be too risky for performance reviews due to potential mistranslations. What I found was that admins actually used machine translations to get started, then validated them through local staff.

2. Admins used spreadsheets to manage translations for their cycles

Building on the first insight, I learnt that admins were using spreadsheets as a way to manage, collaborate and distribute translations between the various different offices that they needed to manage.

Their current workflow looked something like:
- Finalise their questions in their language (mostly English)
- Translate their questions to each language using machine translation
- Distribute automatically translated languages via a spreadsheet to verify with local offices.

3. Cross-lingual reviews important but rare 

I was also concerned about reporting relationships that might involve multiple languages. The interviews revealed that whilst this situation happened, it was a rare situation even in large organisation. This helped us decide to deal with this situation in a later release, helping to sharpen the focus of our initial release.

4. Customers locked in questions first, and then handled translations

I initially thought customers would want to manage questions and translations together to reduce complexity. The interviews showed me they actually think of these as separate steps—questions get approved first, then translated. This helped me decide on the structure of the multilingual workflow (e.g. questions first, then followed by translations.)

## Design Process & Iteration

Based on my research insights, I focused on three core design principles:

1. **Match existing mental models** - Separate questions setup from translation management
2. **Support existing workflows** - Enable spreadsheet import/export for collaboration  
3. **Reduce friction** - Integrate machine translation while allowing manual refinement

I worked through multiple iterations, testing concepts with customers to validate:
- Information architecture for the translation workflow
- Integration points within the existing performance cycle setup
- Balance between automation (Google Translate) and control (manual editing)

**Advocating for expanded scope:** The initial feature brief focused only on manual translations. However, my research revealed customers were already using Google Translate and spreadsheets as workarounds. I advocated to expand the scope to include both Google Translate integration and Excel import/export functionality. This research-driven advocacy transformed the feature from a basic translation input to a comprehensive workflow that matched how customers actually worked.

## Key design details

I designed additions to our existing flow to make adding translations seamless and super easy. The intention of my design was to reduce what was a laborious and convoluted process to something that could be completed in a few clicks and fit into their existing workflow.

1. **Language picker**
- At the start of the flow, there's a "Language" collapsible. This collapsible allowed people to see that you could add more than 1 language, but you didn't need to engage with it unless you needed to. When the collapsible opened, customers could select their "default language" and then select from 140+ languages as additional languages.

2. **Translations view**
- A new view that functions as an extension of the existing "questions" view in our workflow. This allows you to edit translations in 3 ways:
	1. Manual translations - I designed an enhanced input that allows you to see the text of the default language the questions were written in while writing translations
	2. Google Translate - Complete translations using a couple of clicks.
	3. Import/export Excel - Allow admins to manage and edit translations in bulk via their preferred method, spreadsheet.

I designed these details with heavy collaboration with engineering. Key activities here included: 
- Early spikes to determine the viability of integrating Google Translate and import/export Excel workflows
- Close collaboration with Frontend designers to ensure a quality implementation of the manual translations input as well as a seamless experience when switching between RTE and LTE languages.

## Results & Impact
The results validated my research-driven approach:

- Retained a major $1M+ ARR customer who was considering churning due to multilingual limitations
- 4,000+ multilingual reviews completed since launch
- Minimal support tickets related to the feature, indicating intuitive workflow design
- Strong user adoption with customers successfully managing translations across multiple languages

The low support ticket volume was particularly validating. By matching customers' existing mental models (questions first, then translations), I created an intuitive experience that didn't require extensive training or support.
