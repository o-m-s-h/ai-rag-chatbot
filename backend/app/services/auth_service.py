from app.database.mongodb import users_collection
from app.core.security import hash_password, verify_password
from app.core.jwt_handler import create_access_token

async def register_user(data):

    existing_user = await users_collection.find_one({
        "email": data.email
    })

    if existing_user:
        return {
            "success": False,
            "message": "Email already exists"
        }

    hashed_password = hash_password(data.password)

    user_data = {
        "username": data.username,
        "email": data.email,
        "password": hashed_password
    }

    await users_collection.insert_one(user_data)

    return {
        "success": True,
        "message": "User registered successfully"
    }

async def login_user(data):

    user = await users_collection.find_one({
        "email": data.email
    })

    if not user:
        return {
            "success": False,
            "message": "Invalid credentials"
        }

    is_valid = verify_password(
        data.password,
        user["password"]
    )

    if not is_valid:
        return {
            "success": False,
            "message": "Invalid credentials"
        }

    token = create_access_token({
        "user_id": str(user["_id"]),
        "email": user["email"]
    })

    return {
        "success": True,
        "token": token,
        "username": user["username"]
    }