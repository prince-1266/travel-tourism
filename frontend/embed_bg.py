
import base64
import os

try:
    src_path = r'C:\Users\m\.gemini\antigravity\brain\b6f2424f-4152-4405-ba92-617902928a11\uploaded_media_1769682405918.png'
    dest_path = r'c:\Users\m\OneDrive\Desktop\travel and tour\frontend\src\assets\custom-bg.css'
    
    with open(src_path, 'rb') as f:
        data = f.read()
    
    b64 = base64.b64encode(data).decode('utf-8')
    
    css_content = f"""
.bg-custom-purple {{
  background-image: url('data:image/png;base64,{b64}');
  background-size: cover;
  background-attachment: fixed;
  background-position: center;
}}
.dark .bg-custom-purple {{
  background-image: none;
  background-color: #0f172a;
}}
"""
    
    # Ensure directory exists
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    
    with open(dest_path, 'w') as f:
        f.write(css_content)
        
    print("CSS Created Successfully")
    
except Exception as e:
    print(f"Error: {e}")
