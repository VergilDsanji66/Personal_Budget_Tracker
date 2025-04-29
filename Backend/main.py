from fastapi import FastAPI
from data_loader import load_and_process_data
from data_visualization import create_visualizations
import matplotlib.pyplot as plt

app = FastAPI()

@app.get("/visualization")
def create_and_show_visualization():
    # Load and process data
    filtered_df, totals = load_and_process_data()
    
    # Create and show visualizations
    fig = create_visualizations(filtered_df, totals)
    plt.show()
    return {"message": "Visualizations generated!"}
