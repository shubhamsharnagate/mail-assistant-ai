import os
import json
import streamlit as st
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Page configuration
st.set_page_config(
    page_title="MailGenius - AI Email Generator",
    page_icon="✉️",
    layout="centered"
)

# Custom Styling for a beautiful UI
st.markdown("""
<style>
    .main-header {
        font-family: 'Inter', sans-serif;
        text-align: center;
        padding: 20px 0 10px 0;
        color: #1E293B;
    }
    .sub-header {
        font-family: 'Inter', sans-serif;
        text-align: center;
        color: #64748B;
        font-size: 1.1rem;
        margin-bottom: 30px;
    }
    .email-container {
        border-radius: 8px;
        background-color: #F8FAFC;
        padding: 25px;
        border: 1px solid #E2E8F0;
        margin-top: 20px;
        font-family: 'Inter', sans-serif;
    }
    .email-subject {
        font-weight: bold;
        font-size: 1.1rem;
        color: #0F172A;
        border-bottom: 1px solid #CBD5E1;
        padding-bottom: 10px;
        margin-bottom: 15px;
    }
    .email-body {
        white-space: pre-wrap;
        color: #334155;
        line-height: 1.6;
    }
    div[data-testid="stForm"] {
        border: 1px solid #E2E8F0;
        border-radius: 12px;
        padding: 30px;
        background-color: #FFFFFF;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
    }
</style>
""", unsafe_allow_html=True)

# App Logo / Hero Section
st.markdown("<h1 class='main-header'>✉️ MailGenius</h1>", unsafe_allow_html=True)
st.markdown("<p class='sub-header'>Transform ideas into polished, context-appropriate emails in seconds with the power of Google Gemini AI.</p>", unsafe_allow_html=True)

# Illustrative banner using emojis or rich content
st.info("💡 **Pro-Tip:** Providing detailed purpose context results in much higher-quality, custom-tailored outputs.")

# Streamlit Form for inputs
with st.form("email_generator_form"):
    st.subheader("Configure Your Email")
    
    col1, col2 = st.columns(2)
    
    with col1:
        email_type = st.selectbox(
            "Email Type",
            ["Leave Request", "Job Application", "Complaint", "Meeting Request", "Internship Request", "Custom Email"]
        )
        recipient_name = st.text_input("Recipient Name", placeholder="e.g., Sarah Jenkins, HR Manager")
        
    with col2:
        tone = st.selectbox(
            "Email Tone",
            ["Formal", "Professional", "Friendly", "Casual"]
        )
        sender_name = st.text_input("Sender Name (Your Name)", placeholder="e.g., Alex Carter")

    purpose = st.text_area(
        "Main Purpose / Details", 
        placeholder="State clearly what the email is about (e.g., requesting sick leave for Friday, applying for the Frontend Developer role, rescheduling Thursday's meeting to 3 PM)",
        height=100
    )
    
    additional_info = st.text_area(
        "Additional Context (Optional)",
        placeholder="Add details like specific dates, project names, attachments, or custom requirements.",
        height=80
    )
    
    # Form action buttons
    submit_button = st.form_submit_with_clicks = st.form_submit_button("Generate Email ✨", use_container_width=True)

# Generate Email Logic
if submit_button:
    if not recipient_name.strip():
        st.error("⚠️ Please specify a Recipient Name.")
    elif not purpose.strip():
        st.error("⚠️ Please state the Main Purpose of the email.")
    else:
        api_key = os.getenv("GEMINI_API_KEY")
        
        if not api_key:
            st.error("🔑 **Gemini API Key is missing!** Please add your `GEMINI_API_KEY` to the `.env` file or Streamlit secrets to enable AI generation.")
        else:
            with st.spinner("Writing email... ✍️"):
                try:
                    # Lazy initialize Google GenAI Client
                    client = genai.Client(api_key=api_key)
                    
                    prompt = f"""Generate a highly tailored email subject and complete email body with professional formatting.
                    Details:
                    - Email Type / Context: {email_type}
                    - Recipient Name: {recipient_name}
                    - Sender Name: {sender_name if sender_name else 'Anonymous / Not specified'}
                    - Main Purpose / Detail: {purpose}
                    - Desired Tone: {tone}
                    - Additional Details/Context: {additional_info if additional_info else 'None'}

                    Requirements:
                    - Create an engaging, professional, and clear subject line.
                    - Write a complete and natural-sounding email body. 
                    - Avoid placeholder brackets like [Your Name] in the closing if the Sender Name ({sender_name}) is provided; use it instead.
                    - Match the specified tone: {tone}."""

                    response = client.models.generate_content(
                        model="gemini-3.5-flash",
                        contents=prompt,
                        config=types.GenerateContentConfig(
                            system_instruction="You are MailGenius, an expert professional email copywriter and editor. You craft beautifully written, highly effective, and grammatically flawless emails that get results.",
                            temperature=0.7,
                            response_mime_type="application/json",
                            response_schema={
                                "type": "OBJECT",
                                "properties": {
                                    "subject": {"type": "STRING", "description": "The subject line of the email."},
                                    "body": {"type": "STRING", "description": "The complete formatted email body."}
                                },
                                "required": ["subject", "body"]
                            }
                        )
                    )
                    
                    result = json.loads(response.text.strip())
                    subject = result.get("subject", "No Subject Generated")
                    body = result.get("body", "No Body Generated")
                    
                    # Store generated email in session state for potential copy or export
                    st.session_state["subject"] = subject
                    st.session_state["body"] = body
                    
                except Exception as e:
                    st.error(f"❌ Generation failed: {str(e)}")

# Display Generated Email if present in session state
if "subject" in st.session_state and "body" in st.session_state:
    st.markdown("### Generated Email Draft")
    
    st.markdown(f"""
    <div class="email-container">
        <div class="email-subject">Subject: {st.session_state["subject"]}</div>
        <div class="email-body">{st.session_state["body"]}</div>
    </div>
    """, unsafe_allow_html=True)
    
    # Copy support using Streamlit's native copy text block
    full_email_text = f"Subject: {st.session_state['subject']}\n\n{st.session_state['body']}"
    st.text_area("Copyable Raw Version (Select All & Copy)", value=full_email_text, height=200)
    
    col1, col2 = st.columns(2)
    with col1:
        if st.button("Clear Draft 🗑️", use_container_width=True):
            del st.session_state["subject"]
            del st.session_state["body"]
            st.rerun()
    with col2:
        st.success("✨ Ready to send! Use the text box above to copy quickly.")
