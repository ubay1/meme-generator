import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  dragArea: {
    position: "absolute",
    padding: 5, // Padding untuk batas sentuhan handle
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  textInput: {
    fontSize: 20,
    textAlign: "center",
    padding: 0,
    // minWidth: 100, // Sekarang diatur oleh MIN_WIDTH
    // minHeight: 30, // Sekarang diatur oleh MIN_HEIGHT
    flexShrink: 1,
    flexGrow: 1,
    width: "100%", // Pastikan TextInput mengisi 100% dari parentnya
    height: "100%", // Pastikan TextInput mengisi 100% dari parentnya
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    flexShrink: 1,
    flexGrow: 1,
    width: "100%", // Pastikan Text mengisi 100% dari parentnya
    height: "100%", // Pastikan Text mengisi 100% dari parentnya
    textAlignVertical: "center", // Agar teks berada di tengah secara vertikal
  },
  deleteButton: {
    position: "absolute",
    top: -40,
    right: -30,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5, // Tambahkan padding untuk area sentuhan
  },
  moveButton: {
    position: "absolute",
    top: -40,
    left: "40%",
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5, // Tambahkan padding untuk area sentuhan
  },
  copyButton: {
    position: "absolute",
    top: -40,
    left: -30,
    zIndex: 1,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 5, // Tambahkan padding untuk area sentuhan
  },
  // Handle styles
  resizeHandleTopLeft: {
    position: "absolute",
    top: -10, // Geser sedikit agar lebih mudah diakses
    left: -10, // Geser sedikit
    width: 20, // Ukuran handle lebih besar
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10, // Buat bulat
    zIndex: 10,
  },
  resizeHandleTopCenter: {
    position: "absolute",
    top: -10,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleTopRight: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleBottomLeft: {
    position: "absolute",
    bottom: -10,
    left: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleBottomCenter: {
    position: "absolute",
    bottom: -10,
    left: "50%",
    marginLeft: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
  resizeHandleBottomRight: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 20,
    height: 20,
    backgroundColor: "rgba(0, 0, 255, 0.5)",
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 10,
    zIndex: 10,
  },
});