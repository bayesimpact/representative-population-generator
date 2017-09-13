"""Methods to create a master list of California ZIP codes."""
import os

import pandas as pd


def update_zip_list(input_filepath, output_filepath):
    """From county-level census data, generate polygons for California counties."""
    df = pd.read_csv(input_filepath, encoding='latin')
    california_only = df[df['state'] == 'CA']

    try:
        os.remove(output_filepath)
    except FileNotFoundError:
        pass

    california_only.to_csv(output_filepath, sep='\t')
    return california_only


if __name__ == '__main__':
    update_zip_list(
        input_filepath='data/raw/uszipsv1.1.csv',
        output_filepath='data/california_zips.tsv'
    )
