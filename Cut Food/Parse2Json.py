import json
from collections import defaultdict

def main():
    # Path to your JSON file
    file_path = "FoundationFoods.json"
    file_path = "RealFood.json"

    # How many top nutrients to show
    TOP_N = 20

    # Load the JSON file
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    foods = data.get("FoundationFoods", [])

    # Dictionary to count how many foods contain each nutrient (non-zero)
    nutrient_counts = defaultdict(int)

    for food in foods:
        food_nutrients = food.get("foodNutrients", [])
        for nutrient_entry in food_nutrients:
            amount = nutrient_entry.get("amount", 0)
            nutrient_info = nutrient_entry.get("nutrient", {})
            nutrient_name = nutrient_info.get("name", "Unknown")
            unit = nutrient_info.get("unitName", "")
            
            # Only count if amount is greater than zero
            if amount and amount > 0:
                key = f"{nutrient_name} ({unit})"
                nutrient_counts[key] += 1

    # Sort by count (descending)
    sorted_nutrients = sorted(
        nutrient_counts.items(),
        key=lambda x: x[1],
        reverse=True
    )

    # Print top N
    print(f"Top {TOP_N} nutrients by number of foods containing them:\n")
    for i, (nutrient, count) in enumerate(sorted_nutrients[:TOP_N], 1):
        print(f"{i}. {nutrient}: {count} foods")

if __name__ == "__main__":
    main()
