from io import BytesIO
from django.template.loader import get_template
from xhtml2pdf import pisa
from django.http import HttpResponse

def render_to_pdf(template_src, context_dict={}):
    """
    Helper per convertire un template HTML in un file PDF utilizzando xhtml2pdf.
    """
    template = get_template(template_src)
    html = template.render(context_dict)
    result = BytesIO()
    
    # pdf = pisa.pisaDocument(BytesIO(html.encode("UTF-8")), result) # encoding non necessario con django template? 
    # Proviamo con encode per sicurezza
    pdf = pisa.pisaDocument(BytesIO(html.encode("ISO-8859-1")), result)
    
    if not pdf.err:
        return result.getvalue()
    return None
