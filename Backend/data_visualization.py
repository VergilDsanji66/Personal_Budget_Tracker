import matplotlib.pyplot as plt
from matplotlib.figure import Figure

def create_visualizations(df, totals):
    # Create figure
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111)
    
    # Prepare data with absolute values
    sizes = [
        totals['money_in'],
        abs(totals['money_out']),
        abs(totals['fee']),
        totals['balance']
    ]
    
    # Create labels with actual values
    labels = [
        f'Money In\nR{totals["money_in"]:,.2f}',
        f'Money Out\nR{abs(totals["money_out"]):,.2f}',
        f'Fees\nR{abs(totals["fee"]):,.2f}',
        f'Balance\nR{totals["balance"]:,.2f}'
    ]
    
    # Create pie chart (returns only 2 values)
    wedges, texts = ax.pie(
        sizes,
        labels=labels,
        startangle=140,
        colors=['#4CAF50', '#F44336', '#FFC107', '#2196F3'],
        textprops={'fontsize': 12, 'color': 'black'},
        labeldistance=1.1,
        wedgeprops={'linewidth': 1, 'edgecolor': 'white'},
    )
    
    # Add title
    plt.title('Financial Breakdown (March 2025)', 
        fontsize=16, 
        pad=20, 
        weight='bold',
        loc='center')
    
    ax.axis('equal')
    return fig