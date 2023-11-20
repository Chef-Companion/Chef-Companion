import numpy as np

def save_matrix(file_path, matrix):
    np.savetxt(f"{file_path}", matrix, delimiter=",")

def load_matrix(file_path):
    return np.loadtxt(f"{file_path}")
