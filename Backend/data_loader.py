import pandas as pd
from api import memory_db

def load_and_process_data():
    # Load and process data
    
    try:
        df = pd.read_csv('./data/transactions.csv')
    except FileNotFoundError:
        print("File not found. Please ensure the file path is correct.")
        return None, None
    
    df = df.drop(columns=["Account", "Transaction Date", "Description", "Original Description", "Category"])
    
    # Convert and filter dates
    df['Posting Date'] = pd.to_datetime(df['Posting Date'])

    # Ensures the dates are in the correct format
    start_date = pd.to_datetime(memory_db['start_date'][-1]) if memory_db['start_date'] else None
    end_date = pd.to_datetime(memory_db['end_date'][-1]) if memory_db['end_date'] else None

    # Debug print to check the extracted dates
    print(f"Using start_date: {start_date}")
    print(f"Using end_date: {end_date}")

    filtered_df = df[(df['Posting Date'] >= start_date) & (df['Posting Date'] <= end_date)]
    filtered_df = filtered_df.sort_values('Posting Date')
    
    # Calculate totals
    totals = {
        'money_in': round(filtered_df['Money In'].fillna(0).sum(), 2),
        'money_out': round(filtered_df['Money Out'].fillna(0).sum(), 2),
        'fee': round(filtered_df['Fee'].fillna(0).sum(), 2),
        'balance': filtered_df['Balance'].dropna().iloc[-1] if not filtered_df['Balance'].dropna().empty else 0
    }
    
    return filtered_df, totals