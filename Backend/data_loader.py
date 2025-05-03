import pandas as pd
from shared_data import memory_db_1, memory_db_2  # Import both shared states

def load_and_process_data():
    try:
        df = pd.read_csv('./data/transactions.csv')
        df['Posting Date'] = pd.to_datetime(df['Posting Date'])

        mask = (
            (df['Posting Date'] >= pd.to_datetime(memory_db_1["start_date"])) & 
            (df['Posting Date'] <= pd.to_datetime(memory_db_1["end_date"]))
        )
        filtered_df = df.loc[mask]

        if len(filtered_df) > 0:
            # Use .get to avoid KeyErrors and .fillna to handle missing values
            money_in = filtered_df.get('Money In', pd.Series(dtype=float)).fillna(0).sum()
            money_out = filtered_df.get('Money Out', pd.Series(dtype=float)).fillna(0).sum()
            fees = filtered_df.get('Fee', pd.Series(dtype=float)).fillna(0).sum()

            # Sort by Posting Date to ensure it's in order
            filtered_df = filtered_df.sort_values(by='Posting Date')

            # Safely get the last known balance
            latest_balance = (
                filtered_df.get('Balance', pd.Series(dtype=float))
                .dropna()
                .iloc[-1]
                if not filtered_df.get('Balance', pd.Series(dtype=float)).dropna().empty
                else 0.0
            )

            # Update memory_db_2
            memory_db_2.update({
                'total_money_in': round(money_in, 2),
                'total_money_out': round(money_out, 2),
                'latest_balance': round(latest_balance, 2),  # <- renamed key for clarity
                'fees': round(fees, 2),
                'transaction_count': len(filtered_df),
                'date_range_used': f"{memory_db_1['start_date']} to {memory_db_1['end_date']}",
                'last_updated': pd.Timestamp.now().isoformat()
            })

        else:
            print("Warning: No transactions in date range")
        
        return filtered_df

    except Exception as e:
        print(f"Error during processing: {str(e)}")
        return None

