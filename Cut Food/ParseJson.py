import json
from collections import defaultdict

def main():
    # Path to your JSON file
    file_path = "FoundationFoods.json"
    file_path = "RealFood.json"

    # Load the JSON file
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    # FoundationFoods is an array of food objects
    foods = data.get("FoundationFoods", [])

    # Dictionary to sum nutrient totals
    nutrient_totals = defaultdict(float)

    for food in foods:
        food_nutrients = food.get("foodNutrients", [])
        for nutrient_entry in food_nutrients:
            amount = nutrient_entry.get("amount", 0)
            nutrient_info = nutrient_entry.get("nutrient", {})
            nutrient_name = nutrient_info.get("name", "Unknown")
            unit = nutrient_info.get("unitName", "")
            
            # Use both name + unit to distinguish nutrients like mg vs µg
            key = f"{nutrient_name} ({unit})"
            nutrient_totals[key] += amount

    # Sort nutrients by total amount across all foods
    sorted_nutrients = sorted(
        nutrient_totals.items(),
        key=lambda x: x[1],
        reverse=True
    )

    topn = 12

    # Print the top n
    print(f"Top {topn} most plentiful nutrients across all foods:\n")
    for i, (nutrient, total) in enumerate(sorted_nutrients[:topn], 1):
        print(f"{i}. {nutrient}: {total:.2f}")

if __name__ == "__main__":
    main()
