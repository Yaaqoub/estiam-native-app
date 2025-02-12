import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import {StyleSheet, View, ScrollView, Image, Button, RefreshControl} from 'react-native';
import { Text, Card } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';
import {getImageUrl} from '@/utils/getImageUrl';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: number;
  title: string;
  description: string;
  images: string[];
  category: {
    id: number;
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  image: string;
}

interface CategoryParams {
  offset: number;
  limit: number;
  categoryId: number | null;
}

export default function Products() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [categoryParams, setCategoryParams] = useState<CategoryParams>({
    offset: 0,
    limit: 1,
    categoryId: null,
  });

  const getProducts = useCallback(async () => {
    try {
      const params: any = {
        offset: categoryParams.offset,
        limit: categoryParams.limit
      };

      if (categoryParams.categoryId !== null) {
        params.categoryId = categoryParams.categoryId;
      }

      const products = await axios({
        method: 'GET',
        url: 'https://api.escuelajs.co/api/v1/products',
        params
      });

      const formattedProducts: Product[] = products.data.map((item: Product) => {
        return {
          ...item,
          images: [getImageUrl(item.images[0])],
        };
      });

      setProducts((prevProducts) => (
        categoryParams.offset === 0 ? formattedProducts : [...prevProducts, ...formattedProducts]
      ));
      setRefreshing(false);
    } catch (error) {
      setProducts([]);
      setRefreshing(false);
    }
  }, [categoryParams]);

  const getCategories = useCallback(async () => {
    try {
      const categories = await axios({
        method: 'GET',
        url: 'https://api.escuelajs.co/api/v1/categories',
      });

      setCategories(categories.data);
    } catch (error) {
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    getProducts();
  }, [categoryParams]);

  const loadProducts = () => {
    setCategoryParams((prevState) => ({
      ...prevState,
      offset: prevState.offset + prevState.limit,
    }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setCategoryParams({
      offset: 0,
      limit: 1,
      categoryId: null,
    });
  };

  const handleCategoryChange = (categoryValue: number | null) => {
    let _cat = categoryValue;
    if (categoryValue) {
      _cat = JSON.parse(categoryValue.toString());
    }
    setCategoryParams((prevState) => ({
      ...prevState,
      offset: 0,
      categoryId: _cat,
    }));
  };

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>You need to login before opening this page</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      <View>
        <Picker
          selectedValue={categoryParams.categoryId}
          onValueChange={(value) => handleCategoryChange(value)}
          style={styles.picker}
          itemStyle={{
            color: '#000000',
          }}
        >
          <Picker.Item label="All Categories" value={null} />
          {categories.map((category) => (
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id}
            />
          ))}
        </Picker>
      </View>

      <ScrollView
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {
          products.map((product, index) => (
            <Card key={index}>
              <Card.Title>{`(${product.id}) ${product.title}`}</Card.Title>
              <Card.Divider/>
              <View style={{position:"relative",alignItems:"center"}}>
                <Image
                  source={{ uri: product.images[0] }}
                  style={{width:"100%",height:100}}
                  resizeMode="contain"
                />
                <Text >{product.description}</Text>
                <Text >{product.category.name}</Text>
              </View>
            </Card>
          ))
        }
      </ScrollView>
      <View>
        <Button
          title="Load More"
          onPress={loadProducts}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
    marginHorizontal: 40,
    flex: 1,
  },
  picker: {
    marginVertical: 10,
  }
});
