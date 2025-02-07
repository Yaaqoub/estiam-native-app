import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import {StyleSheet, View, ScrollView, Image} from 'react-native';
import { Text, Card } from '@rneui/themed';

interface User {
  email: string;
  name: string;
  avatar: string;
}
export default function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const getUsers = useCallback(async () => {
    try {
      const users = await axios({
        method: 'GET',
        url: 'https://api.escuelajs.co/api/v1/users',
      });

      setUsers(users.data);
    } catch (error) {
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    getUsers();
  }, [getUsers]);


  return (
    <View style={styles.container}>
      <ScrollView>
        {
          users.map((user, index) => (
            <Card key={index}>
              <Card.Title>{user.name}</Card.Title>
              <Card.Divider/>
              <View style={{position:"relative",alignItems:"center"}}>
                <Image
                  source={{ uri: user.avatar }}
                  style={{width:"100%",height:100}}
                  resizeMode="contain"
                />
                <Text >{user.email}</Text>
              </View>
            </Card>
          ))
        }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    marginHorizontal: 40,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8
  },
});
