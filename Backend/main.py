from data_loader import load_and_process_data
from data_visualization import create_visualizations
import matplotlib.pyplot as plt

def main():
    # Load and process data
    filtered_df, totals = load_and_process_data()
    
    # Create and show visualizations
    fig = create_visualizations(filtered_df, totals)
    plt.show()

if __name__ == "__main__":
    main()