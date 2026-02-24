# Dada's Physics

## Current State

The website currently features:
- Hero section with educator introduction (Devjyoti Chatterjee, 8 years experience)
- About section with teaching philosophy
- Why Choose Us section with teaching methodology
- Student Reviews section with a form to submit feedback
- Topics covered section showcasing physics curriculum areas
- Courses section with 3 courses:
  - Class 11 WBCHSE (1st semester + JEE/NEET)
  - Class 12 WBCHSE (3rd semester + JEE/NEET)
  - Class 11 CBSE (+ NEET/JEE)
- Contact section with form and contact details
- Backend system for storing and retrieving student reviews

## Requested Changes (Diff)

### Add
1. **New Course**: Class 12 CBSE + NEET/JEE preparation
   - Starts from March 1st week
   - Details to be added to the courses section
   
2. **Free Resources Section**: New section for free learning materials
   - YouTube channel link: https://youtube.com/@dadasphysics5474?si=3oMHVfVSkGwgouAf
   - Upload functionality for free notes (PDFs, documents)
   - Upload functionality for YouTube lecture links
   - Display uploaded resources in an organized manner

3. **Backend Functionality**:
   - Store and retrieve free notes (file metadata, URLs)
   - Store and retrieve YouTube lecture links
   - Admin capability to upload resources

### Modify
- Update courses section layout to accommodate 4 courses instead of 3
- Update navigation to include new "Free Resources" section link

### Remove
- None

## Implementation Plan

1. **Backend Development**:
   - Add data structures for storing:
     - Free notes (title, description, file URL, upload date)
     - YouTube lecture links (title, description, video URL, upload date)
   - Create functions to:
     - Add free notes
     - Add YouTube lecture links
     - Retrieve all free notes
     - Retrieve all YouTube lecture links
     - Delete resources (admin functionality)

2. **Frontend Development**:
   - Add Class 12 CBSE course card to the courses section with:
     - Start date: March 1st week
     - CBSE Board badge
     - NEET/JEE preparation included
     - Contact for admission CTA
   
   - Create new "Free Resources" section featuring:
     - Prominent YouTube channel link with branding
     - Two subsections: "Free Notes" and "Video Lectures"
     - Upload forms for admin to add resources
     - Display grid/list of available resources
     - Download/view links for notes
     - Embedded or linked YouTube videos
   
   - Update header navigation to include "Free Resources" link

3. **UI/UX Enhancements**:
   - Ensure consistent styling with existing design system
   - Add appropriate icons (YouTube, document, download icons)
   - Responsive layout for resource cards
   - Loading states for resource uploads
   - Success/error toast notifications

## UX Notes

- The Free Resources section should feel generous and accessible, encouraging students to explore free content
- YouTube channel link should be prominently displayed with a clear call-to-action
- Resource upload forms should be simple and intuitive
- Consider adding categories/tags for notes and videos (e.g., "Mechanics", "Electromagnetism", "Class 11", "Class 12")
- Display upload dates to show freshness of content
- Use appropriate file type icons for different document formats
