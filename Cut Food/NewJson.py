import json

def filter_nutrients(input_file, output_file, keep_nutrients, top_n=10):
    """
    Create a reduced JSON file keeping only the top N nutrients.
    
    Parameters:
        input_file (str): Path to the input JSON file.
        output_file (str): Path to write the filtered JSON.
        keep_nutrients (list[str]): List of nutrient names (with unit) to keep.
        top_n (int): How many of the keep_nutrients to keep (slice).
    """
    with open(input_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    foods = data.get("FoundationFoods", [])

    # Limit to the top_n nutrients
    keep_set = set(keep_nutrients[:top_n])

    filtered_foods = []
    for food in foods:
        # Copy only the "essential" food fields
        new_food = {
            "description": food.get("description", ""),
            "foodNutrients": []
        }

        # Keep only nutrients in keep_set
        for nutrient_entry in food.get("foodNutrients", []):
            amount = nutrient_entry.get("amount", 0)
            nutrient_info = nutrient_entry.get("nutrient", {})
            name = nutrient_info.get("name", "Unknown")
            unit = nutrient_info.get("unitName", "")
            key = f"{name} ({unit})"

            if key in keep_set:
                new_food["foodNutrients"].append({
                    "nutrient": {
                        "name": name,
                        "unitName": unit
                    },
                    "amount": amount
                })

        filtered_foods.append(new_food)

    # Save reduced JSON
    reduced_data = {"FoundationFoods": filtered_foods}
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(reduced_data, f, indent=2, ensure_ascii=False)

    print(f"Filtered JSON saved to {output_file}")


if __name__ == "__main__":
    # Example usage:
    # Suppose these are your top nutrients (from the first script output)
    top_nutrients = [
        "Potassium, K (mg)",
        "Zinc, Zn (mg)",
        "Magnesium, Mg (mg)",
        "Protein (g)",
        "Phosphorus, P (mg)",
        "Calcium, Ca (mg)",
        "Total lipid (fat) (g)",
        "Water (g)",
        "Iron, Fe (mg)",
        "Carbohydrate, by difference (g)",
        "Sodium, Na (mg)",
        "Vitamin B-6 (mg)"
    ]

    filter_nutrients(
        input_file="RealFood.json",
        output_file="FilteredFoods.json",
        keep_nutrients=top_nutrients,
        top_n=12  # adjust as needed
    )


