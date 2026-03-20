import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'newsflow_backend.settings')
django.setup()

from news.models import Tag

print("--- LISTA TAG DAL DATABASE ---")
for t in Tag.objects.all():
    print(f"'{t.nome}' (slug: {t.slug})")
print(f"Totale: {Tag.objects.count()}")
