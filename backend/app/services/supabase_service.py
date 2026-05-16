from supabase import create_client

from app.core.config import settings

supabase = create_client(
    settings.SUPABASE_URL,
    settings.SUPABASE_KEY
)

bucket_name = settings.SUPABASE_BUCKET

def upload_file_to_supabase(
    file_name,
    file_bytes
):

    path = f"temp/{file_name}"

    supabase.storage.from_(bucket_name).upload(
        path,
        file_bytes
    )

    return path

def download_file_from_supabase(
    path
):

    response = supabase.storage.from_(
        bucket_name
    ).download(path)

    return response

def delete_file_from_supabase(
    path
):

    supabase.storage.from_(
        bucket_name
    ).remove([path])