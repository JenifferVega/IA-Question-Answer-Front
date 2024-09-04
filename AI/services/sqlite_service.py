# services/sqlite_service.py

import sqlite3
import os

class SQLiteService:
    def __init__(self, user_email, document_name, db_name='chat_data.db'):
        self.user_email = user_email
        self.document_name = document_name
        self.db_name = db_name
        self.db_path = self.get_db_path()

    def get_db_path(self):
        """
        Constructs the full path for the SQLite database based on the user's email and document name.
        """
        user_folder = os.path.join('uploads', self.user_email)
        document_folder = os.path.join(user_folder, self.document_name)
        os.makedirs(document_folder, exist_ok=True)
        return os.path.join(document_folder, self.db_name)

    def init_db(self):
        """
        Initializes the SQLite database by creating the necessary tables.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_content (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL
            )
        ''')
        
        conn.commit()
        conn.close()
        print(f"Database initialized at '{self.db_path}'")

    def save_html_content(self, html_content):
        """
        Saves the HTML content into the SQLite database.
        
        Parameters:
        - html_content (str): The HTML content to save.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO chat_content (content)
            VALUES (?)
        ''', (html_content,))
        
        conn.commit()
        conn.close()
        print("HTML content saved successfully.")

    def fetch_html_content(self):
        """
        Fetches all HTML content from the database.
        
        Returns:
        - content (list): A list of all HTML content stored in the database.
        """
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('SELECT content FROM chat_content')
        content = cursor.fetchall()
        
        conn.close()
        return content

    def delete_db(self):
        """
        Deletes the SQLite database file.
        """
        if os.path.exists(self.db_path):
            os.remove(self.db_path)
            print(f"Database '{self.db_path}' deleted successfully.")
        else:
            print(f"Database '{self.db_path}' does not exist.")
