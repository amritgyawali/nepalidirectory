import os
from bs4 import BeautifulSoup
import re

# Define the root directory
ROOT_DIR = "."

# Mapping of keywords in link text to relative paths from ROOT_DIR
LINK_MAPPINGS = {
    "home": "Home.dc.html",
    "about": "about_us_nepali_directory/code.html",
    "contact": "contact_us_nepali_directory/code.html",
    "privacy": "privacy_policy_nepali_directory/code.html",
    "terms": "terms_of_service_nepali_directory/code.html",
    "blog": "blog_index_nepali_directory/code.html",
    "advertise": "Advertise.dc.html",
    "login": "Login.dc.html",
    "log in": "Login.dc.html",
    "sign up": "Register.dc.html",
    "register": "Register.dc.html",
    "categories": "Categories.dc.html",
    "find": "Search Results.dc.html",
    "search": "Search Results.dc.html",
    "review": "Write Review.dc.html",
    "dashboard": "Dashboard.dc.html",
    "account": "Dashboard.dc.html",
    "profile": "user_profile_nepali_directory/code.html",
    "restaurant": "restaurants_category_nepali_directory/code.html",
    "app": "get_the_app_nepali_directory/code.html",
    "city": "City Landing.dc.html",
    "kathmandu": "City Landing.dc.html",
    "pokhara": "City Landing.dc.html",
    "lalitpur": "City Landing.dc.html",
    "bhaktapur": "City Landing.dc.html",
    "plumber": "Search Results.dc.html",
    "doctor": "Search Results.dc.html",
    "hotel": "Search Results.dc.html",
    "contractor": "Search Results.dc.html",
    "electrician": "Search Results.dc.html",
    "auto repair": "Search Results.dc.html",
    "lawyer": "Search Results.dc.html",
    "beauty": "Search Results.dc.html",
    "school": "Search Results.dc.html",
    "map": "map_directions_nepali_directory/code.html",
    "q&a": "q_a_hub_nepali_directory/code.html",
    "question": "q_a_hub_nepali_directory/code.html",
    "gallery": "photo_gallery_nepali_directory/code.html",
    "partner": "Claim Listing.dc.html",
    "claim": "Claim Listing.dc.html",
    "business detail": "Business Detail.dc.html"
}

def get_relative_path(from_file, to_file):
    from_dir = os.path.dirname(from_file)
    if not from_dir:
        from_dir = "."
    rel_path = os.path.relpath(to_file, from_dir)
    return rel_path.replace("\\", "/")

def get_target_path(text):
    text_lower = text.lower()
    for keyword, target in LINK_MAPPINGS.items():
        if keyword in text_lower:
            return target
    return None

html_files = []
for root, dirs, files in os.walk(ROOT_DIR):
    # skip .git or other hidden dirs if any, though not strictly necessary
    if '.git' in root or '.antigravityignore' in root:
        continue
    for file in files:
        if file.endswith(".html"):
            html_files.append(os.path.join(root, file))

for file_path in html_files:
    print(f"Processing {file_path}")
    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")
    modified = False

    # 1. Update <a> tags
    for a_tag in soup.find_all("a"):
        href = a_tag.get("href", "")
        # If href is missing, empty, "#" or points to a non-existent file
        if not href or href == "#" or href.startswith("javascript:"):
            target = get_target_path(a_tag.get_text())
            if not target and a_tag.get("title"):
                 target = get_target_path(a_tag.get("title"))
            
            if target:
                rel_path = get_relative_path(file_path, target)
                a_tag["href"] = rel_path
                modified = True
            else:
                # Default to home if nothing else matches
                a_tag["href"] = get_relative_path(file_path, "Home.dc.html")
                modified = True
        else:
            # Maybe the href is a direct filename but needs path adjustment
            # if we're in a subdirectory. Let's leave absolute urls alone.
            if not href.startswith("http") and not href.startswith("mailto") and not href.startswith("#"):
                # if it just points to "Home.dc.html" from a subdirectory, it's broken.
                # But it's hard to parse if it's already correct. We'll try our best:
                basename = os.path.basename(href)
                # find if basename is in our mappings
                for target_path in LINK_MAPPINGS.values():
                    if target_path.endswith(basename):
                         rel_path = get_relative_path(file_path, target_path)
                         if a_tag["href"] != rel_path:
                             a_tag["href"] = rel_path
                             modified = True
                         break

    # 2. Update buttons to navigate if they look like a search or action button
    for btn in soup.find_all("button"):
        text = btn.get_text().lower()
        if not btn.get("onclick"):
            target = get_target_path(text)
            if target:
                rel_path = get_relative_path(file_path, target)
                btn["onclick"] = f"window.location.href='{rel_path}';"
                modified = True
            elif "search" in text or "find" in text:
                rel_path = get_relative_path(file_path, "Search Results.dc.html")
                btn["onclick"] = f"window.location.href='{rel_path}';"
                modified = True

    # 3. Add link around header logos if they don't have one
    # This might be too complex and brittle, let's stick to standard tags.

    if modified:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(str(soup))
        print(f"Updated {file_path}")

print("Done linking pages.")
