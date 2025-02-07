import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import {StyleSheet, View, ScrollView, Image, Button, RefreshControl} from 'react-native';
import { Text, Card } from '@rneui/themed';
import { Picker } from '@react-native-picker/picker';

interface Product {
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

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(1);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const getProducts = useCallback(async (reset = false, categoryId: number | null = null) => {
    let _offset = offset;

    try {
      if (reset) {
        _offset = 0;
      }

      const formattedProducts: Product[] = [];
      const products = await axios({
        method: 'GET',
        url: 'https://api.escuelajs.co/api/v1/products',
        params: {
          offset: _offset,
          limit,
          ...(categoryId && {categoryId: categoryId})
        }
      });

      for (const product of products.data) {
        let imageUrl: string = '';
        try {
          imageUrl = (new URL(product.images[0])).toString();
        } catch (error) {
          imageUrl = 'https://projetcartylion.fr/wp-content/uploads/2020/08/Placeholder-600x600.png';
        }

        formattedProducts.push({
          ...product,
          images: [imageUrl]
        });
      }

      if (reset) {
        setProducts(formattedProducts);
        setRefreshing(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...formattedProducts]);
      }
    } catch (error) {
      setProducts([]);
    }
  }, [limit, offset]);

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
    getProducts();
    getCategories();
  }, []);

  const loadProducts = () => {
    setOffset((prevOffset) => prevOffset + limit);
    getProducts(false, selectedCategory);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setOffset(0);
    setSelectedCategory(null);
    getProducts(true);
  };

  const handleCategoryChange = (categoryValue: number | null) => {
    setSelectedCategory(categoryValue);
    setOffset(0);
    getProducts(true, categoryValue);
  };

  return (
    <View style={styles.container}>

      <View>
        <Picker
          selectedValue={selectedCategory}
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
              <Card.Title>{product.title}</Card.Title>
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
