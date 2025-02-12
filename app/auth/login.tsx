import {
  TouchableWithoutFeedback,
  TouchableOpacity, StyleSheet, Text, TextInput, View, Keyboard,
  KeyboardAvoidingView, Platform
} from 'react-native';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Login</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your email"
              value={'test@email.com'}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Enter your password"
              value={'***********'}
              style={styles.input}
            />
          </View>
          <TouchableOpacity
            style={styles.button}
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    marginBottom: 30,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: '100%',
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#1E90FF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 20,
  }
});
