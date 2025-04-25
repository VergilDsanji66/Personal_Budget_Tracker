import pandas as pd

def load_and_process_data():
    # Load and process data
    df = pd.read_csv('./data/transactions.csv')
    df = df.drop(columns=["Account", "Transaction Date", "Description", "Original Description", "Category"])
    
    # Convert and filter dates
    df['Posting Date'] = pd.to_datetime(df['Posting Date'])
    filtered_df = df[(df['Posting Date'] >= '2025-03-01') & 
                    (df['Posting Date'] <= '2025-03-31')]
    filtered_df = filtered_df.sort_values('Posting Date')
    
    # Calculate totals
    totals = {
        'money_in': round(filtered_df['Money In'].fillna(0).sum(), 2),
        'money_out': round(filtered_df['Money Out'].fillna(0).sum(), 2),
        'fee': round(filtered_df['Fee'].fillna(0).sum(), 2),
        'balance': filtered_df['Balance'].dropna().iloc[-1] if not filtered_df['Balance'].dropna().empty else 0
    }
    
    return filtered_df, totals